"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Check, ChevronLeft, Clock, Copy, ExternalLink, FileIcon, MapPin, Mic,  UserPlus, Video, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Prisma } from "@prisma/client"
import { cn } from "@/lib/utils"
import {

  FileTextIcon,
  ImageIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileVideoIcon,
  FileSpreadsheetIcon,
  FileCodeIcon,
  
} from "lucide-react"
import { InviteDialog } from "./schedule/InviteDialog"
import { CancelDialog } from "./schedule/CancelDialog"
import Link from "next/link"

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

interface MeetingDetailsProps {
  meeting: Meeting
  onClose: () => void
  isMobile?: boolean
}

const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || ""
}

 const getFileType = (filename: string): string => {
    const extension = getFileExtension(filename)

    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension)) {
      return "image"
    }
    if (["pdf"].includes(extension)) {
      return "pdf"
    }
    if (["doc", "docx", "txt", "rtf", "odt"].includes(extension)) {
      return "document"
    }
    if (["xls", "xlsx", "csv", "ods"].includes(extension)) {
      return "spreadsheet"
    }
    if (["ppt", "pptx", "odp"].includes(extension)) {
      return "presentation"
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      return "archive"
    }
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return "audio"
    }
    if (["mp4", "avi", "mov", "wmv", "mkv", "webm"].includes(extension)) {
      return "video"
    }
    if (["js", "ts", "jsx", "tsx", "html", "css", "json", "py", "java", "c", "cpp", "php"].includes(extension)) {
      return "code"
    }

    return "other"
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileIcon className="h-4 w-4 text-red-500" />
      case "document":
        return <FileTextIcon className="h-4 w-4 text-blue-500" />
      case "spreadsheet":
        return <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />
      case "presentation":
        return <FileTextIcon className="h-4 w-4 text-orange-500" />
      case "archive":
        return <FileArchiveIcon className="h-4 w-4 text-purple-500" />
      case "audio":
        return <FileAudioIcon className="h-4 w-4 text-pink-500" />
      case "video":
        return <FileVideoIcon className="h-4 w-4 text-indigo-500" />
      case "code":
        return <FileCodeIcon className="h-4 w-4 text-gray-500" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-teal-500" />
      default:
        return <FileIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getAvatarColor = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return "bg-red-100"
      case "document":
        return "bg-blue-100"
      case "spreadsheet":
        return "bg-green-100"
      case "presentation":
        return "bg-orange-100"
      case "archive":
        return "bg-purple-100"
      case "audio":
        return "bg-pink-100"
      case "video":
        return "bg-indigo-100"
      case "code":
        return "bg-gray-100"
      case "image":
        return "bg-teal-100"
      default:
        return "bg-gray-100"
    }
  }

export function MeetingDetails({ meeting, onClose, isMobile = false }: MeetingDetailsProps) {
 
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

    const copyMeetingLink = (text:string) => {
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
  
    const isButtonDisabled = () => {
      const now = new Date()
      const actualStartTime = combineDateAndTime(meeting.startDate, meeting.startTime)
      const endTime = new Date(actualStartTime.getTime() + meeting.duration * 60000)
    
      if (now < actualStartTime) {
        return false
      } else if (now >= actualStartTime && now <= endTime) {
        return true
      }  else {
        return false
      }
      
    }

  // Helper function to determine if a meeting is online
  const isOnlineMeeting = (meeting: Meeting) => {
    // Assuming meetings without a physical location are online
    return !meeting.description.toLowerCase().includes("location:")
  }

  // Format dates and times
  const formattedDate = format(meeting.startDate, "EEEE, dd MMMM yyyy")
  const formattedTime = format(meeting.startTime, "hh:mm a")
  const formattedDuration = `${meeting.duration} minutes`
  const meetingIsOnline = isOnlineMeeting(meeting)
  const location = meetingIsOnline ? "Online Meeting" : "In-person Meeting"

  // Extract location details from description if available
  const getLocationDetails = () => {
    if (meetingIsOnline) return null

    const locationMatch = meeting.description.match(/location:\s*(.*?)(?:\n|$)/i)
    return locationMatch ? locationMatch[1].trim() : null
  }

  const locationDetails = getLocationDetails()

  const combineDateAndTime = (startDate: Date, startTime: Date): Date => {
    const combined = new Date(startDate)
    combined.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds())
    return combined
  }

  const actualStartTime = combineDateAndTime(meeting.startDate, meeting.startTime)
  const endTime = new Date(actualStartTime.getTime() + meeting.duration * 60000)

  return (
    <div className="flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Header with subtle gradient and improved typography */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white shadow-sm">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 mr-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="font-semibold text-gray-800 tracking-tight">{isMobile ? meeting.topic : "Meeting Details"}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-0">
        <div className="space-y-0">
          {/* Meeting Title with improved styling */}
          <div className="bg-black p-5 shadow-sm">
            {!isMobile && (
              <div>
                <h3 className="text-xl font-semibold text-white tracking-tight">{meeting.topic}</h3>
                <p className="text-sm text-white mt-1 leading-relaxed">{meeting.description}</p>
              </div>
            )}

            {/* Mobile only description */}
            {isMobile && <h3 className="text-xl font-semibold text-white tracking-tight">{meeting.topic}</h3>}
            {isMobile && <p className="text-sm text-white leading-relaxed">{meeting.description}</p>}
          </div>

          {/* Meeting Info with card-like styling */}
          <div className="bg-white p-5 shadow-sm border-t border-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wider">Meeting Details</h4>
            <div className="space-y-4">
              <div className="flex items-start group">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{formattedDate}</p>
                  <p className="text-sm text-gray-500">
                    {formattedTime} - {format(endTime, "h:mm a")}
                    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {formattedDuration}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center mr-3 group-hover:bg-purple-100 transition-colors">
                  {meetingIsOnline ? (
                    <Video className="h-4 w-4 text-purple-600" />
                  ) : (
                    <MapPin className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{location}</p>
                  {meetingIsOnline && isButtonDisabled() && (
                    <div className="flex items-center mt-1">
                      <div className="flex items-center px-2 gap-5 py-1 bg-blue-50 rounded-md">
                        <p className="text-xs text-blue-700 font-medium truncate max-w-[180px]">Meeting Link</p>
                        <Button
                        className="rounded-full"
                        onClick={()=>copyMeetingLink(`${process.env.NEXT_PUBLIC_CONFERENCE_URL}/join/${meeting.id}`)}>
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
                      </Button>
                      </div>
                    </div>
                  )}
                  {!meetingIsOnline && locationDetails && (
                    <p className="text-xs text-gray-500 mt-1 bg-gray-50 px-2 py-1 rounded-md">{locationDetails}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start group">
                <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center mr-3 group-hover:bg-amber-100 transition-colors">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Duration: {formattedDuration}</p>
                  {meeting.recurring && (
                    <div className="mt-1 flex items-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        Recurring
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {meeting.recurringType} (until{" "}
                        {meeting.endDate ? format(meeting.endDate, "MMM d, yyyy") : "N/A"})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Video className={cn("w-4 h-4", meeting.muteVideo ? "text-green-500" : "text-gray-400")} />
              <span>Video {meeting.muteVideo ? "On" : "Off"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mic className={cn("w-4 h-4", meeting.muteAudio ? "text-green-500" : "text-gray-400")} />
              <span>Audio {meeting.muteAudio ? "On" : "Off"}</span>
            </div>
          </div>

          {/* Files section with improved styling */}
          {meeting.files && meeting.files.length > 0 && (
            <div className="bg-white p-5 shadow-sm border-t border-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                <FileIcon className="w-4 h-4" /> Attached Files
              </h4>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <ul className="divide-y divide-gray-100">
                  {meeting.files.map((file, index) => {
                    const fileType = getFileType(file.name)
                    const fileIcon = getFileIcon(fileType)
                    const avatarColor = getAvatarColor(fileType)

                    return (
                      <li key={index} className="flex items-center p-3 hover:bg-gray-50 transition-colors">
                        <Avatar className="w-10 h-10 mr-3 rounded-lg overflow-hidden shadow-sm">
                          {fileType === "image" && file.url ? (
                            <AvatarImage
                              src={file.url || "/placeholder.svg"}
                              alt={file.name}
                              className="object-cover"
                            />
                          ) : null}
                          <AvatarFallback className={cn("rounded-lg flex items-center justify-center", avatarColor)}>
                            {fileIcon}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <span className="capitalize">{fileType}</span>
                            <span className="mx-1">•</span>
                            <span>Added {new Date().toLocaleDateString()}</span>
                          </span>
                        </div>

                        {file.url && (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 flex items-center justify-center h-8 w-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* Invite section with improved styling */}
          <div className="bg-white p-5 shadow-sm border-t border-gray-50">
            <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Participants</h4>
              <div className="flex flex-col md:flex-row gap-2 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-colors"
                  onClick={() => setIsCancelDialogOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                  <span>Reschedule</span>
                </Button>
               {isButtonDisabled() && <Button
                  className="h-9 px-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-sm"
                  onClick={() => setIsInviteDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  <span>Invite</span>
                </Button>}
                {meeting.agenda && isButtonDisabled() &&
                <Link href={`/i/meeting/agenda/${meeting.id}`} target="__blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-colors"
                  >
                    <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>Develop Agenda</span>
                  </Button>
                </Link>
                }
                
              </div>
            </div>

            {/* Participant avatars could go here */}
           
            <div className="mt-4 flex -space-x-2 overflow-hidden">
              
            {
           
              meeting.participants?.map(participant=>(
                <Avatar key={participant.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white">
                <AvatarImage src={participant.user.image as string} />
                <AvatarFallback className="bg-blue-500 text-white">{participant.user.name}</AvatarFallback>
              </Avatar>
              ))
            }
              
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <InviteDialog meeting={meeting} isOpen={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />
      <CancelDialog meeting={meeting} isOpen={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen} />
    </div>
  )
}
