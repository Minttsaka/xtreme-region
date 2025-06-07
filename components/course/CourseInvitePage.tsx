"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Calendar, Clock, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { acceptCourseInvitation, } from "@/app/actions/actions"
import { UserCourse } from "@prisma/client"


export function CourseInvite({ course }: {course: UserCourse }) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "accepting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)


  const handleAccept = async () => {

    try {
      setStatus("accepting")
      setErrorMessage(null)

      const result = await acceptCourseInvitation(course.id)

      if (!result.error) {
        setStatus("success")
        // Redirect to the course page immediately
        router.push(`/i/course/agenda/${course.id}`)
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
          <CardTitle className="text-xl font-semibold text-gray-800">course Invitation</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">{course.title}</h3>
            {course.content && (
              <p className="text-sm text-blue-700 mb-3">{course.content}</p>
            )}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm text-blue-700">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span>{format(new Date(course.startDate), "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center text-sm text-blue-700">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                <span>
                  {format(new Date(course.duration), "h:mm a")} ({course.duration} minutes)
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
