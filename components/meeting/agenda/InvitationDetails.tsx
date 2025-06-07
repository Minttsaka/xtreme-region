"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Calendar, Clock, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { acceptInvitation } from "@/app/actions/actions"
import { Meeting } from "@prisma/client"


export function InvitationDetails({ meeting , userId  }: {meeting: Meeting , userId:string}) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "accepting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)


  const handleAccept = async () => {

    try {
      setStatus("accepting")
      setErrorMessage(null)

      const result = await acceptInvitation(userId, meeting.id)

      if (!result.error) {
        setStatus("success")
        // Redirect to the meeting page immediately
        router.push(`/i/meeting/agenda/${meeting.id}`)
      } else {
        setErrorMessage(result.status || "Failed to accept invitation")
        setStatus("error")
      }
    } catch (error) {
      console.error("Error accepting invitation:", error)
      setErrorMessage("An unexpected error occurred")
      setStatus("error")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
      <Card className="border-0 shadow-none overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-gray-800">Meeting Invitation</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">{meeting.topic}</h3>
            {meeting.description && (
              <p className="text-sm text-blue-700 mb-3">{meeting.description}</p>
            )}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm text-blue-700">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span>{format(new Date(meeting.startDate), "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center text-sm text-blue-700">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                <span>
                  {format(new Date(meeting.duration), "h:mm a")} ({meeting.duration} minutes)
                </span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          <Button
            onClick={handleAccept}
            disabled={status === "accepting"}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            {status === "accepting" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Accept
              </>
            ) }
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
