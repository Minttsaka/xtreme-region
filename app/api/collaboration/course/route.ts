import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import AWS from "aws-sdk"
import Handlebars from "handlebars"
import fs from "fs"
import path from "path"
import { format } from "date-fns"
import { isValidEmail } from "@/app/utils/email-invitation"
import { getUser } from "@/lib/user"
import { prisma } from "@/lib/db"

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  region: 'us-east-1',
})

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
  secure: false
})

// Load email template
let compiledTemplate: Handlebars.TemplateDelegate
try {
  const templatePath = path.join(process.cwd(), "emails", "course-collaboration.hbs")
  const emailTemplate = fs.readFileSync(templatePath, "utf8")
  compiledTemplate = Handlebars.compile(emailTemplate)
} catch (error) {
  console.error("Error loading email template:", error)
  compiledTemplate = Handlebars.compile(`
    <h1>You're invited to collaborate on: {{title}}</h1>
    <p>Start Date: {{month}} {{day}}, {{year}}</p>
    <p>Time: {{time}} (UTC)</p>
    <p>Duration: {{duration}} minutes</p>
    <p><a href="{{collaborationLink}}">Access Course</a></p>
  `)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipients, course, sender = process.env.EMAIL_SENDER || "admin@dctfusion.tech" } = body

    if (!isValidEmail(sender)) {
      return NextResponse.json({ error: "Invalid sender email address" }, { status: 400 })
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients are required and must be an array" }, { status: 400 })
    }

    if (!course || !course.id || !course.title || !course.startDate || !course.duration) {
      return NextResponse.json({ error: "Valid course details are required" }, { status: 400 })
    }

    const validRecipients = recipients.filter(email => {
      const isValid = isValidEmail(email)
      if (!isValid) console.warn(`Skipping invalid email: ${email}`)
      return isValid
    })

    if (validRecipients.length === 0) {
      return NextResponse.json({ error: "No valid recipient emails" }, { status: 400 })
    }

    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: validRecipients,
        },
      },
      select: {
        email: true,
        id: true,
        name: true,
      },
    })

    if (existingUsers.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No matching users found for provided emails",
        skippedEmails: validRecipients,
      }, { status: 404 })
    }

    const successfulCollaborations = []
    const failedCollaborations = []

    for (const user of existingUsers) {
      try {
        const existingCollaboration = await prisma.collaborators.findFirst({
          where: {
            userId: user.id,
            courseId: course.id
          }
        })

        if (existingCollaboration) {
          failedCollaborations.push({ email: user.email, reason: "Already a collaborator" })
          continue
        }

        await prisma.collaborators.create({
          data: {
            user:{
              connect:{
                id: user.id
              }
            },
            type:"COURSE",
            course:{
              connect:{
                id: course.id
              }
            }
          }
        })

        successfulCollaborations.push(user)
      } catch (error) {
        console.error(`Error adding collaborator ${user.email}:`, error)
        failedCollaborations.push({
          email: user.email,
          reason: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }

    if (successfulCollaborations.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Failed to add any collaborators",
        failedCollaborations
      }, { status: 500 })
    }

    const startDate = new Date(course.startDate)
    const month = format(startDate, "MMM").toUpperCase()
    const day = format(startDate, "d")
    const year = format(startDate, "yyyy")
    const time = format(startDate, "h a")
    const formattedTime = time

    const user = await getUser()

    const courseLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/i/course/invite-course/${course.id}`

    const templateData = {
      title: course.title,
      month,
      day,
      year,
      time: formattedTime,
      duration: course.duration,
      organizerName: user?.name || "Course Organizer",
      organizerContact: user?.email,
      collaborationLink: courseLink,
    }

    const htmlContent = compiledTemplate(templateData)

    const textContent = `
      Collaboration Invite: ${course.title}

      Start Date: ${month} ${day}, ${year}
      Time: ${formattedTime} (UTC)
      Duration: ${course.duration} minutes
      Organizer: ${user?.name} - ${user?.email}

      Join here: ${courseLink}
    `

    const successfulEmails = successfulCollaborations.map(user => user.email)

    const emailPromises = successfulEmails.map(async (recipient) => {
      try {
        const mailOptions = {
          from: `Course App <${sender}>`,
          to: recipient as string,
          subject: `Collaboration Invite: ${course.title}`,
          text: textContent,
          html: htmlContent,
        }
        return await transporter.sendMail(mailOptions)
      } catch (error) {
        console.error(`Error sending email to ${recipient}:`, error)
        throw error
      }
    })

    await Promise.all(emailPromises)

    const nonExistingEmails = validRecipients.filter(
      email => !existingUsers.some(user => user.email === email)
    )

    return NextResponse.json({
      success: true,
      message: `Invitations sent to ${successfulEmails.length} recipient(s)`,
      invitedUsers: successfulEmails,
      failedCollaborations,
      nonExistingUsers: nonExistingEmails,
      invalidEmails: recipients.filter(email => !validRecipients.includes(email))
    })
  } catch (error) {
    console.error("Error sending invitations:", error)
    return NextResponse.json(
      { error: "Failed to send invitations", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
