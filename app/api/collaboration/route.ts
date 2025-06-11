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

// {
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASSWORD,
//   },
//   secure: false
// }

const transporter = nodemailer.createTransport(
  {
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_MAIL_USER,      // Your Gmail address
        pass: process.env.GOOGLE_MAIL_PASS  // Your Gmail password or App Password
    }
  }

)


// Read the email template
let compiledTemplate: Handlebars.TemplateDelegate
try {
  const templatePath = path.join(process.cwd(), "emails", "invite-collaboration.hbs")
  const emailTemplate = fs.readFileSync(templatePath, "utf8")
  compiledTemplate = Handlebars.compile(emailTemplate)
} catch (error) {
  console.error("Error loading email template:", error)
  // Fallback to a simple template if the file can't be loaded
  compiledTemplate = Handlebars.compile(`
    <h1>Meeting Invitation: {{topic}}</h1>
    <p>Date: {{month}} {{day}}, {{year}}</p>
    <p>Time: {{time}} ({{timezone}})</p>
    <p>Location: {{location}}</p>
    <p><a href="{{meetingLink}}">Join Meeting</a></p>
  `)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipients, meeting, sender = process.env.EMAIL_SENDER || "admin@dctfusion.tech" } = body

    // Validate sender email
    if (!isValidEmail(sender)) {
      console.error(`Invalid sender email: ${sender}`)
      return NextResponse.json({ error: "Invalid sender email address" }, { status: 400 })
    }

    // Validate recipients array
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients are required and must be an array" }, { status: 400 })
    }

    // Validate meeting details
    if (!meeting || !meeting.id) {
      return NextResponse.json({ error: "Valid meeting details are required" }, { status: 400 })
    }

    // Filter out invalid emails
    const validRecipients = recipients.filter((email) => {
      const isValid = isValidEmail(email)
      if (!isValid) {
        console.warn(`Skipping invalid email format: ${email}`)
      }
      return isValid
    })

    if (validRecipients.length === 0) {
      return NextResponse.json({ error: "No valid recipient email addresses provided" }, { status: 400 })
    }

    // Query only existing users in the system
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: validRecipients,
        },
      },
      select: { 
        email: true,
        id: true,
        name: true
      },
    })

    if (existingUsers.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "No matching users found in the system for the provided emails",
        skippedEmails: validRecipients
      }, { status: 404 })
    }

    // Track successful collaborator additions
    const successfulCollaborations = []
    const failedCollaborations = []

    // Add each existing user as a collaborator
    for (const user of existingUsers) {
      try {
        // Check if collaboration already exists
        const existingCollaboration = await prisma.collaborators.findFirst({
          where: {
            userId: user.id,
            meetingId: meeting.id
          }
        })

        if (existingCollaboration) {
             failedCollaborations.push({
            email: user.email,
            reason: "Already a collaborator"
          })
          continue
        }

        // Create new collaborator record
        await prisma.collaborators.create({
          data: {
            user: {
              connect: {
                id: user.id
              }
            },
            type:"MEETING",
            meeting: {
              connect: {
                id: meeting.id
              }
            },
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

    // If no collaborations were successful, return error
    if (successfulCollaborations.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Failed to add any collaborators",
        failedCollaborations
      }, { status: 500 })
    }

    // Format date/time for email
    const startDate = new Date(meeting.startDate)
    const startTime = new Date(meeting.startTime)

    const meetingDateTime = new Date(startDate)
    meetingDateTime.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds())

    const month = format(startDate, "MMM").toUpperCase()
    const day = format(startDate, "d")
    const year = format(startDate, "yyyy")
    const time = format(meetingDateTime, "h")
    const ampm = format(meetingDateTime, "a")
    const formattedTime = `${time} ${ampm}`

    // Get organizer info
    const user = await getUser()

    // Meeting link
    const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/i/meeting/invite-collaboration/${meeting.id}`

    // Template data
    const templateData = {
      topic: meeting.topic,
      month,
      day,
      year,
      time: formattedTime,
      location: meeting.location || "Virtual Meeting",
      timezone: meeting.timeZone || "UTC",
      duration: meeting.duration,
      description: meeting.description || "",
      organizerName: user?.name || "Meeting Organizer",
      organizerContact: user?.email,
      platform: meeting.platform || "xtreme-region",
      collaborationLink: meetingLink,
    }

    // Compile HTML from template
    const htmlContent = compiledTemplate(templateData)

    // Fallback plain text
    const textContent = `
      Collaboration Invite: ${meeting.topic}

      Date: ${month} ${day}, ${year}
      Time: ${formattedTime} (${meeting.timeZone || "UTC"})
      Duration: ${meeting.duration} minutes
      Location: ${meeting.location || "Virtual Meeting"}
      Organizer: ${user?.name} - ${user?.email}

      ${meeting.description ? `Description: ${meeting.description}` : ""}

      Join here: ${meetingLink}
      Website: www.xtremeregion.com
    `

    // Send email only to successfully added collaborators
    const successfulEmails = successfulCollaborations.map(user => user.email)
    
    // Send email to each valid, existing recipient who was successfully added as a collaborator
    const emailPromises = successfulEmails.map(async (recipient) => {
      try {
        const mailOptions = {
          from: `Meeting App <${sender}>`,
          to: recipient as string,
          subject: `Collaboration Invite: ${meeting.topic}`,
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

    // Calculate skipped emails (valid format but not in system)
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
