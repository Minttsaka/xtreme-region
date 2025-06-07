import fs from "fs"
import path from "path"
import type { Meeting } from "@prisma/client"

/**
 * Formats meeting data for email sending
 */
export function formatMeetingForEmail(meeting: Meeting) {
  return {
    ...meeting,
    startDate: meeting.startDate instanceof Date ? meeting.startDate.toISOString() : meeting.startDate,
    startTime: meeting.startTime instanceof Date ? meeting.startTime.toISOString() : meeting.startTime,
  }
}

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Gets all unique emails from an array of emails and class IDs
 */
export async function getAllRecipientEmails(
  emails: string[],
  classIds: number[],
  fetchClassMembers: (classId: number) => Promise<string[]>,
): Promise<string[]> {
  // Get emails from classes
  const classEmailPromises = classIds.map((id) => fetchClassMembers(id))
  const classEmailsArrays = await Promise.all(classEmailPromises)
  const classEmails = classEmailsArrays.flat()

  // Combine all emails and remove duplicates
  return [...new Set([...emails, ...classEmails])]
}

/**
 * Ensures the emails directory exists
 */
export function ensureEmailsDirectoryExists() {
  const emailsDir = path.join(process.cwd(), "emails")
  if (!fs.existsSync(emailsDir)) {
    fs.mkdirSync(emailsDir, { recursive: true })
  }
}

