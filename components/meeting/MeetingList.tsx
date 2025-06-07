"use client"

import { format, isToday } from "date-fns"
import {  CheckCircle,  Clock3, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Prisma } from "@prisma/client"
import { Badge } from "../ui/badge"
import { getSession } from "@/lib/sessionStore"

type Meeting = Prisma.MeetingGetPayload<{
  include: {
    files: true
    host: true
    participants:{
      include:{
        user:true
      }
    }
  }
}>

interface MeetingListProps {
  meetings: Meeting[]
  onSelectMeeting: (meeting: Meeting) => void
  selectedMeetingId: string | undefined
}

export function MeetingList({ meetings, onSelectMeeting, selectedMeetingId }: MeetingListProps) {
  // Helper function to determine if a meeting is online
  const isOnlineMeeting = (meeting: Meeting) => {
    // Assuming meetings without a physical location are online
    return !meeting.description.toLowerCase().includes("location:")
  }

  const handleMeetingAction = (startTime: Date, startDate: Date, duration: number,meetingId:string) => {

    sessionChecker()
    const now = new Date()
    const actualStartTime = combineDateAndTime(startDate, startTime)
    const endTime = new Date(actualStartTime.getTime() + duration * 60000)

    if (now < actualStartTime) {
    
    } else if (now >= actualStartTime && now <= endTime) {
      window.open(`${process.env.NEXT_PUBLIC_CONFERENCE_URL}/join/${meetingId}`, "_blank")
    } 
  }


    const sessionChecker = async () => {
  
      const session = await getSession()
  
      if (!session){
        window.location.href = '/signin'
      }
    }

  const getButtonLabel = (startTime: Date, startDate: Date, duration: number) => {
    const now = new Date()
    const actualStartTime = combineDateAndTime(startDate, startTime)
    const endTime = new Date(actualStartTime.getTime() + duration * 60000)
  
    if (now < actualStartTime) {
      return "View"
    } else if (now >= actualStartTime && now <= endTime) {
      return "Join Meeting"
    }  else {
      return "Meeting is over"
    }
  }
  

  const isButtonDisabled = (startTime: Date, startDate: Date) => {
    const now = new Date()
    const actualStartTime = combineDateAndTime(startDate, startTime)
  
    return now < actualStartTime
  }
  

  // Helper function to get meeting color based on recurring status
  const getMeetingColor = (meeting: Meeting) => {
    if (meeting.recurring) return "blue"
    return "yellow"
  }
  // Format date for grouping
  const getFormattedDate = (date: Date) => {
    return format(date, "EEEE, dd MMMM yyyy")
  }

  // Group meetings by date
  const meetingsByDate = meetings.reduce(
    (acc, meeting) => {
      const dateKey = getFormattedDate(meeting.startDate)
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(meeting)
      return acc
    },
    {} as Record<string, Meeting[]>,
  )

  const combineDateAndTime = (startDate: Date, startTime: Date): Date => {
    const combined = new Date(startDate)
    combined.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds())
    return combined
  }

  const determineMeetingStatus = (startTime: Date, startDate: Date, duration: number) => {
    const now = new Date()
    const actualStartTime = combineDateAndTime(startDate, startTime)
    const endTime = new Date(actualStartTime.getTime() + duration * 60000)
  
    if (now < actualStartTime) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
          <Clock3 className="w-3 h-3" /> Waiting
        </Badge>
      )
    } else if (now >= actualStartTime && now <= endTime) {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1 animate-pulse"
        >
          <Zap className="w-3 h-3" /> In Progress
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Completed
        </Badge>
      )
    }
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      {Object.entries(meetingsByDate).map(([date, dateMeetings]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="bg-gray-50 px-4 py-2 border-b">
            <div className="flex items-center">
              <span className="text-sm font-medium">{date}</span>
              {isToday(dateMeetings[0].startDate) && (
                <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">TODAY</span>
              )}
            </div>
          </div>

          {/* Meetings for this date */}
          {dateMeetings.map((meeting) => {
            const actualStartTime = combineDateAndTime(meeting.startDate, meeting.startTime)
            const meetingColor = getMeetingColor(meeting)
            const meetingIsOnline = isOnlineMeeting(meeting)
            const formattedTime = format(meeting.startTime, "hh:mm a")
            const formattedDuration = `${meeting.duration}min`
            const location = meetingIsOnline ? "Online Meeting" : "In-person Meeting"
            const endTime = new Date(actualStartTime.getTime() + meeting.duration * 60000)

            return (
              <div
                key={meeting.id}
                className={`border-b cursor-pointer ${selectedMeetingId === meeting.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                onClick={() => onSelectMeeting(meeting)}
              >
                <div className="flex items-start p-4">
                  {/* Time and Color Indicator */}
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-6 h-6 rounded-full bg-${meetingColor}-400 flex items-center justify-center`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="w-px h-full bg-gray-200 my-1"></div>
                  </div>

                  {/* Meeting Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between gap-2 md:gap-0">
                      <div>
                        <div className="text-sm font-medium">{formattedTime} - {format(endTime, "h:mm a")}</div>
                        <div className="text-xs text-gray-500">
                          {formattedDuration} · {location}
                        </div>
                        <div className="flex text-xs items-center gap-2 text-gray-600">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span>{meeting.timeZone || "UTC"}</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">{meeting.topic}</div>
                      <div className="flex md:block items-center justify-between md:justify-start">
                        <div className="text-xs text-gray-500 md:text-right">
                          Lead: {meeting.host.name || "Unknown"}
                        </div>
                        <div className="text-xs font-medium md:text-right">{determineMeetingStatus(meeting.startTime,meeting.startDate, meeting.duration)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-4 hidden md:flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isButtonDisabled(meeting.startTime, meeting.startDate)}
                        onClick={() => handleMeetingAction(meeting.startTime, meeting.startDate, meeting.duration, meeting.id)}
                        className="text-xs h-7 border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <span className="mr-1">🎥</span> {getButtonLabel(meeting.startTime, meeting.startDate, meeting.duration)}
                      </Button>
                    
                  </div>
                </div>

                {/* Mobile Actions - Shown below meeting details on small screens */}
                <div className="px-4 pb-3 flex md:hidden">
                <Button
                    variant="outline"
                        size="sm"
                        disabled={isButtonDisabled(meeting.startTime, meeting.startDate)}
                        onClick={() => handleMeetingAction(meeting.startTime, meeting.startDate, meeting.duration, meeting.id)}
                        className="text-xs h-7 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <span className="mr-1">🎥</span> {getButtonLabel(meeting.startTime, meeting.startDate, meeting.duration)}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center">Youve reached the end of the list</div>
    </div>
  )
}
