"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Mail, UserPlus, X, CheckCircle2, Check, Copy, Link2 } from "lucide-react"
import { CourseList } from "@/types/course"
import { toast } from "sonner"

interface InviteDialogProps {
  course: CourseList
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}
// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CLASS_MEMBERS = {
  1: ["ebs21-mtsaka@mubas.ac.mw", "marketing2@example.com", "marketing3@example.com"],
  2: ["eng1@example.com", "eng2@example.com", "eng3@example.com"],
  3: ["design1@example.com", "design2@example.com"],
  4: ["product1@example.com", "product2@example.com"],
  5: ["support1@example.com", "support2@example.com"],
  6: ["sales1@example.com", "sales2@example.com"],
}

export function InviteCourseCollaboration({ course, isOpen, onOpenChange }: InviteDialogProps) {
  const [emailInput, setEmailInput] = useState("")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [selectedClasses, setSelectedClasses] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Add this state inside the InviteDialog component function
  const [copied, setCopied] = useState(false)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmailInput("")
      setSelectedEmails([])
      setSelectedClasses([])
    }
  }, [isOpen])

  useEffect(() => {
    toast(error)
  }, [error])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Add this function inside the InviteDialog component function
  const copycourseLink = (text:string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value)

    // Check if the input ends with a space, comma, or semicolon
    if (e.target.value.endsWith(" ") || e.target.value.endsWith(",") || e.target.value.endsWith(";")) {
      const email = e.target.value.slice(0, -1).trim()
      if (EMAIL_REGEX.test(email) && !selectedEmails.includes(email)) {
        setSelectedEmails([...selectedEmails, email])
        setEmailInput("")
      }
    }
  }

  const handleEmailInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add email on Enter key
    if (e.key === "Enter" && emailInput.trim()) {
      e.preventDefault()
      const email = emailInput.trim()
      if (EMAIL_REGEX.test(email) && !selectedEmails.includes(email)) {
        setSelectedEmails([...selectedEmails, email])
        setEmailInput("")
      }
    }

    // Remove the last email on Backspace if input is empty
    if (e.key === "Backspace" && !emailInput && selectedEmails.length > 0) {
      const newSelectedEmails = [...selectedEmails]
      newSelectedEmails.pop()
      setSelectedEmails(newSelectedEmails)
    }
  }

  const removeEmail = (email: string) => {
    setSelectedEmails(selectedEmails.filter((e) => e !== email))
  }


 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Add the current input if it's a valid email
    const allEmails = [...selectedEmails]
    if (emailInput.trim() && EMAIL_REGEX.test(emailInput.trim()) && !selectedEmails.includes(emailInput.trim())) {
      allEmails.push(emailInput.trim())
      setSelectedEmails(allEmails)
      setEmailInput("")
    }

    // Get all emails from selected classes
    const classEmails: string[] = []
    selectedClasses.forEach((classId) => {
      const members = (CLASS_MEMBERS as Record<number, string[]>)[classId]
      if (members) {
        classEmails.push(...members)
      }
    })

    // Combine all recipients and remove duplicates
    const allRecipients = [...new Set([...allEmails, ...classEmails])]

    if (allRecipients.length === 0) {
      setError("Please add at least one recipient")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/collaboration/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients: allRecipients,
          course: {
            ...course,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitations")
      }

      // Close dialog after a delay
      setTimeout(() => {
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      console.error("Error sending invitations:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-blue-500" />
            Invite to Collaborate.
          </DialogTitle>
          <DialogDescription>Send collaboration {course.title}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="emails" className="w-full">
          <div className="px-6">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="emails" className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Email Invites
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit}>
            <TabsContent value="emails" className="mt-0 px-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Recipient Emails
                  </Label>

                  <div className="min-h-[120px] max-h-[200px] border rounded-md p-2 bg-white overflow-y-auto">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedEmails.map((email, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="pl-2 pr-1 py-1 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700"
                        >
                          <Mail className="h-3 w-3 mr-1 text-blue-500" />
                          {email}
                          <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="ml-1 rounded-full p-0.5 hover:bg-blue-200 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <div className="relative">
                      <Input
                        ref={inputRef}
                        id="email"
                        type="text"
                        placeholder="Type email and press Enter"
                        className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-8 py-1 h-8"
                        value={emailInput}
                        onChange={handleEmailInputChange}
                        onKeyDown={handleEmailInputKeyDown}
                      />
                      <Mail className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    Press Enter, space, or comma after each email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">course Details</Label>
                  <p>{course.content}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Link2 className="h-3.5 w-3.5" />
                    Invite Link
                  </Label>
                  <div className="flex items-center">
                    <div className="flex w-28 bg-gray-50 rounded-l-md p-2.5 border border-r-0 text-sm font-mono text-gray-600 overflow-hidden">
                      {process.env.NEXT_PUBLIC_APP_URL}/i/course/invite-course/{course.id}
                    </div>
                    <button
                      type="button"
                      onClick={()=>copycourseLink(`${process.env.NEXT_PUBLIC_APP_URL}/i/course/invite-course/${course.id}`)}
                      className={cn(
                        "flex items-center justify-center h-10 px-3 rounded-r-md border transition-colors",
                        copied
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200",
                      )}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Share this link with attendees to join the course directly</p>
                </div>
              </div>
            </TabsContent>


            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t flex justify-end">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="border-gray-300"
                >
                  Cancel
                </Button>

                {/* Unique button design */}
                <button
                  type="submit"
                  disabled={isSubmitting || (selectedEmails.length === 0 && selectedClasses.length === 0)}
                  className={cn(
                    "relative overflow-hidden group px-6 py-2 rounded-full font-medium text-white",
                    "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500",
                    "hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300",
                    "disabled:opacity-70 disabled:pointer-events-none",
                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:via-indigo-500 before:to-blue-500",
                    "before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
                  )}
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Sending Invites...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm">Send Invitations</span>
                      </>
                    )}
                  </span>

                  {/* Animated particles */}
                  <span className="absolute top-0 left-0 w-full h-full">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn("absolute w-1 h-1 rounded-full bg-white opacity-0 group-hover:animate-particle")}
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 1}s`,
                          animationDuration: `${1 + Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

