"use client"

import { useState } from "react"
import { Calendar, ChevronRight, Clock, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { parse,setHours, setMinutes } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { lessonMeetingSchedule } from "@/app/actions/actions"
import { Prisma } from "@prisma/client"

type LessonMeeting = {
    topic:string,
    description:string,
    lessonId: string,
    startDate: Date | undefined,
    startTime: Date,
    duration: number,
    muteAudio:boolean,
    muteVideo:boolean,
  } 

  type Lesson = Prisma.LessonGetPayload<{
    include:{
      resources:true
    }
  }>
  
const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
]

const durationOptions = [15, 30, 45, 60, 90, 120]

export function LessonScheduler({ lesson }:{ lesson:Lesson }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>(new Date().toISOString())
  const [currentStep, setCurrentStep] = useState(0)
  const [open, setOpen] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState<number>(30)
  const [micEnabled, setMicEnabled] = useState<boolean>(true)
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true)

  const convertToDateTime = (): Date => {
    const baseDate = date ?? new Date()
  
    const parsedTime = parse(selectedTime, 'hh:mm a', new Date())
  
    const hours = parsedTime.getHours()
    const minutes = parsedTime.getMinutes()
  
    return setMinutes(setHours(baseDate, hours), minutes)
  }
  

  const handleNext = async () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Create meeting object
      const newMeeting : LessonMeeting = {
        topic:lesson.title,
        description:lesson.description,
        lessonId: lesson.id,
        startDate: date,
        startTime: convertToDateTime(),
        duration: selectedDuration,
        muteAudio:micEnabled,
        muteVideo:videoEnabled,
      }
      try {

        await lessonMeetingSchedule(newMeeting)

      } catch (error) {
        console.error(error)
        
      }

      // Reset form and close dialog
      setOpen(false)
      setTimeout(() => {
        setCurrentStep(0)
      }, 500)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
                    variant="ghost" 
                    className="w-full group/button bg-gradient-to-r from-green-100 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 text-slate-700 border border-white/60 rounded-xl h-11"
                  >
                    <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent font-medium">Go Live</span>
                    <div className="relative ml-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full w-5 h-5 flex items-center justify-center group-hover/button:translate-x-1 transition-transform">
                      <ChevronRight className="h-3 w-3 text-white" />
                    </div>
                  </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-black border border-indigo-500/20 text-white backdrop-blur-xl bg-opacity-80 p-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-violet-900/20 pointer-events-none" />

            <div className="relative z-10">
              <DialogHeader className="px-6 pt-6 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse" />
                  <DialogTitle className="text-lg font-light tracking-wide">XTREMEREGION</DialogTitle>
                </div>
                <DialogDescription className="text-xs text-indigo-200 mt-1 font-light">
                  Schedule your next-generation learning experience
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-4 mt-2">
                  <div className="flex space-x-1">
                    {[0, 1].map((step) => (
                      <div
                        key={step}
                        className={`h-0.5 w-12 rounded-full ${step <= currentStep ? "bg-indigo-500" : "bg-gray-700"}`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] text-indigo-300 font-mono">STEP {currentStep + 1}/2</div>
                </div>

                <div className="min-h-[400px]">
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-xs font-medium mb-3 text-indigo-300 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> SELECT DATE
                        </h3>
                        <div className="border border-gray-800 rounded-md p-2">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="text-[10px]"
                            classNames={{
                              day_selected: "bg-indigo-600 text-white hover:bg-indigo-600",
                              day_today: "bg-indigo-900/30 text-white",
                              day: "text-[10px] h-7 w-7 p-0 font-normal",
                              head_cell: "text-[10px] text-indigo-300",
                              caption: "text-xs",
                              nav_button: "h-6 w-6",
                              table: "w-full border-collapse",
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-medium mb-3 text-indigo-300 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> SELECT TIME & DURATION
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-[10px] text-indigo-300 mb-2">TIME</div>
                            <div className="grid grid-cols-4 gap-2">
                              {timeSlots.map((time) => (
                                <div
                                  key={time}
                                  className={`border rounded-md p-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                                    selectedTime === time
                                      ? "border-indigo-500 bg-indigo-900/30"
                                      : "border-gray-800 hover:border-indigo-500/50"
                                  }`}
                                  onClick={() => setSelectedTime(time)}
                                >
                                  <span className="text-[10px]">{time}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] text-indigo-300 mb-2">DURATION (MINUTES)</div>
                            <div className="grid grid-cols-6 gap-2">
                              {durationOptions.map((duration) => (
                                <div
                                  key={duration}
                                  className={`border rounded-md p-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                                    selectedDuration === duration
                                      ? "border-indigo-500 bg-indigo-900/30"
                                      : "border-gray-800 hover:border-indigo-500/50"
                                  }`}
                                  onClick={() => setSelectedDuration(duration)}
                                >
                                  <span className="text-[10px]">{duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xs font-medium mb-3 text-indigo-300 flex items-center">
                        <Zap className="h-3 w-3 mr-1" /> CONFIRM SCHEDULE
                      </h3>

                      <div className="border border-gray-800 rounded-md p-4 bg-black/50">
                        <div className="space-y-3">
                          <div className="flex space-x-4">
                            <div>
                              <div className="text-[10px] text-indigo-300">DATE</div>
                              <div className="text-xs font-medium">
                                {date?.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] text-indigo-300">TIME</div>
                              <div className="text-xs font-medium">{selectedTime}</div>
                            </div>

                            <div>
                              <div className="text-[10px] text-indigo-300">DURATION</div>
                              <div className="text-xs font-medium">{selectedDuration} min</div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-800">
                            <div className="text-[10px] text-indigo-300 mb-2">MEETING OPTIONS</div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setMicEnabled(!micEnabled)}
                                className={`p-2 rounded-md text-[10px] flex items-center ${
                                  micEnabled ? "bg-indigo-900/50 text-white" : "bg-gray-800/50 text-gray-400"
                                }`}
                              >
                                {micEnabled ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                  </svg>
                                )}
                                {micEnabled ? "Mic On" : "Mic Off"}
                              </button>

                              <button
                                onClick={() => setVideoEnabled(!videoEnabled)}
                                className={`p-2 rounded-md text-[10px] flex items-center ${
                                  videoEnabled ? "bg-indigo-900/50 text-white" : "bg-gray-800/50 text-gray-400"
                                }`}
                              >
                                {videoEnabled ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                    <path d="M15 7a2 2 0 0 1 2 2v4.76L21 17V7l-7 5V7a2 2 0 0 0-2-2H9"></path>
                                    <path d="M3 7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-.76L7 9.5V15"></path>
                                  </svg>
                                )}
                                {videoEnabled ? "Video On" : "Video Off"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-[10px] text-center text-indigo-300">
                        By confirming, you agree to the Nexus Learning System{" "}
                        <span className="underline cursor-pointer">Terms of Service</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="text-[10px] h-8 border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Back
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 0 && (!selectedTime || !selectedDuration))
                    }
                    className="text-[10px] h-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  >
                    {currentStep === 1 ? "Confirm Scheduling" : "Continue"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
