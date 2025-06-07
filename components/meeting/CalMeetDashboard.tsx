"use client"

import { useState } from "react"
import { MeetingList } from "./MeetingList"
import { MeetingDetails } from "./MettingDetails"
import type { Prisma } from "@prisma/client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "../ui/badge"

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

type Collaborators = Prisma.CollaboratorsGetPayload<{
  include:{
    meeting:{
      include:{
        files:true,
        host:true,
        participants:{
          include:{
            user:true
          }
        }
      }
    }
  }
}>

type Participated = Prisma.ParticipantsGetPayload<{
  include:{
    meeting:{
      include:{
        files:true,
        host:true,
        participants:{
          include:{
            user:true
          }
        }
      }
    }
  }
}>

interface CalMeetDashboardProps {
  meetings: Meeting[]
  collaborations: Collaborators[]
  participated:Participated[]
}

export function CalMeetDashboard({ meetings , collaborations, participated}: CalMeetDashboardProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("your-meetings")

  const handleSelectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    // On mobile, open the details panel when a meeting is selected
    if (window.innerWidth < 768) {
      setIsMobileDetailsOpen(true)
    }
  }

  const handleCloseMeetingDetails = () => {
    setSelectedMeeting(null)
    setIsMobileDetailsOpen(false)
  }

  const collaboratedMeetings = collaborations.map(collabo => collabo.meeting)

  const participatedMeetings = participated.map(participate => participate.meeting)

  return (
    <div className="flex h-screen w-full bg-slate-50">
   
      {/* Main Content */}
      <div className="flex-1 flex flex-col  w-full">
        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col md:flex-row">
            {/* Meeting List Panel */}
            <div className={`flex-1 p-4 md:p-6 overflow-hidden ${isMobileDetailsOpen ? "hidden md:block" : "block"}`}>
              <div className="max-w-3xl mr-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3 md:gap-0">
                  <div>
                    <h1 className="text-xl font-semibold">Events Overview</h1>
                    <p className="text-sm text-gray-500">
                      Plan, Schedule, Coordinate and track your events and meetings with CalMeet.
                    </p>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b overflow-x-auto">
                    <TabsList className="h-auto min-h-14 w-full justify-start gap-2 sm:gap-4 md:gap-6 bg-transparent p-0 flex-wrap sm:flex-nowrap">
                      <TabsTrigger
                        value="your-meetings"
                        className="relative h-12 sm:h-14 rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium data-[state=active]:border-primary whitespace-nowrap flex items-center"
                      >
                        <span className="mr-1">Your Meetings</span>
                        <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm">
                          {meetings.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="collaborated"
                        className="relative h-12 sm:h-14 rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium data-[state=active]:border-primary whitespace-nowrap flex items-center"
                      >
                        <span className="mr-1">Collaborated</span>
                        <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm">
                          {collaboratedMeetings.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="attended"
                        className="relative h-12 sm:h-14 rounded-none border-b-2 border-transparent px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium data-[state=active]:border-primary whitespace-nowrap flex items-center"
                      >
                        <span className="mr-1">Attended</span>
                        <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm">
                          {participatedMeetings.length}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="your-meetings" className="pt-4 sm:pt-6">
                    <MeetingList
                      meetings={meetings}
                      onSelectMeeting={handleSelectMeeting}
                      selectedMeetingId={selectedMeeting?.id}
                    />
                  </TabsContent>

                  <TabsContent value="collaborated" className="pt-4 sm:pt-6">
                    <MeetingList
                      meetings={collaboratedMeetings as Meeting[]}
                      onSelectMeeting={handleSelectMeeting}
                      selectedMeetingId={selectedMeeting?.id}
                    />
                  </TabsContent>

                  <TabsContent value="attended" className="pt-4 sm:pt-6">
                    <MeetingList
                      meetings={participatedMeetings}
                      onSelectMeeting={handleSelectMeeting}
                      selectedMeetingId={selectedMeeting?.id}
                    />
                  </TabsContent>
                </Tabs>

                
              </div>
            </div>

            {/* Meeting Details Panel - Desktop */}
            <div
              className={`hidden md:block w-1/2 border-l bg-white overflow-auto transition-all duration-300 ${
                selectedMeeting ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {selectedMeeting && <MeetingDetails meeting={selectedMeeting} onClose={handleCloseMeetingDetails} />}
            </div>

            {/* Meeting Details Panel - Mobile (Full Screen) */}
            <div className={`md:hidden fixed inset-0 bg-white z-50 ${isMobileDetailsOpen ? "block" : "hidden"}`}>
              {selectedMeeting && (
                <MeetingDetails meeting={selectedMeeting} onClose={handleCloseMeetingDetails} isMobile={true} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
