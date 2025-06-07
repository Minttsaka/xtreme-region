import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import Handlebars from "handlebars"
import fs from "fs"
import path from "path"
import { format } from "date-fns"
import { isValidEmail } from "@/app/utils/email-invitation"

// Create Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
  secure: false
})

// Read the email template
let compiledTemplate: Handlebars.TemplateDelegate
try {
  const templatePath = path.join(process.cwd(), "emails", "meeting-invitation.hbs")
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

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "Recipients are required and must be an array" }, { status: 400 })
    }

    if (!meeting) {
      return NextResponse.json({ error: "Meeting details are required" }, { status: 400 })
    }

    // Filter out invalid email addresses
    const validRecipients = recipients.filter((email) => {
      const isValid = isValidEmail(email)
      if (!isValid) {
        console.warn(`Skipping invalid email: ${email}`)
      }
      return isValid
    })

    if (validRecipients.length === 0) {
      return NextResponse.json({ error: "No valid recipient email addresses provided" }, { status: 400 })
    }

    // Format meeting date and time
    const startDate = new Date(meeting.startDate)
    const startTime = new Date(meeting.startTime)

    // Combine date and time
    const meetingDateTime = new Date(startDate)
    meetingDateTime.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds())

    // Format date components for the template
    const month = format(startDate, "MMM").toUpperCase()
    const day = format(startDate, "d")
    const year = format(startDate, "yyyy")
    const time = format(meetingDateTime, "h")
    const ampm = format(meetingDateTime, "a")
    const formattedTime = `${time} ${ampm}`

    // Create meeting link
    const meetingLink = `${process.env.NEXT_PUBLIC_CONFERENCE_URL}/join/${meeting.id}`

    // Prepare template data
    const templateData = {
      topic: meeting.topic,
      month: month,
      day: day,
      year: year,
      time: formattedTime,
      location: meeting.location || "Virtual Meeting",
      timezone: meeting.timeZone || "UTC",
      duration: meeting.duration,
      description: meeting.description || "",
      contactPhone: "+123-456-7890", // Replace with actual contact info
      contactWebsite: "www.yourwebsite.com", // Replace with actual website
      meetingLink: meetingLink,
    }

    // Render the HTML email content
    const htmlContent = compiledTemplate(templateData)

    // Create text email content (fallback for email clients that don't support HTML)
    const textContent = `
      Meeting Invitation: ${meeting.topic}
      
      Date: ${month} ${day} ${year}
      Time: ${formattedTime} (${meeting.timeZone || "UTC"})
      Duration: ${meeting.duration} minutes
      Location: ${meeting.location || "Virtual Meeting"}
      
      ${meeting.description ? `Description: ${meeting.description}` : ""}
      
      Join Meeting: ${meetingLink}
      
      Please come on time!
      
      Contact: +123-456-7890
      Website: www.yourwebsite.com
    `

    // Send emails to all recipients
    const emailPromises = validRecipients.map(async (recipient: string) => {
      try {
        const mailOptions = {
          from: `Meeting App <${sender}>`,
          to: recipient,
          subject: `Meeting Invitation: ${meeting.topic}`,
          text: textContent,
          html: htmlContent,
        }

        return await transporter.sendMail(mailOptions)
      } catch (error) {
        console.error(`Error sending email to ${recipient}:`, error instanceof Error ? error.message : String(error))
        throw error
      }
    })

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises)

    return NextResponse.json({
      success: true,
      message: `Invitations sent to ${validRecipients.length} recipient(s)`,
      skippedCount: recipients.length - validRecipients.length,
      messageIds: results.map(result => result.messageId),
    })
  } catch (error) {
    console.error("Error sending invitations:", error instanceof Error ? {
      message: error.message,
      stack: error.stack,
    } : String(error))
    
    return NextResponse.json(
      { error: "Failed to send invitations", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}