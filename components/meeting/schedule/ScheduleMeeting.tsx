

"use client"

import React, {type ChangeEvent, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Clock, ChevronRight, ChevronLeft, Dot } from "lucide-react"
import { LoadingState } from "./LoadingState"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { uploadFileTos3 } from "@/lib/aws"

type Files = {
  type:string,
  url: string
}

export type SchedulerInput = {
    topic: string
    date: Date
    time: string
    duration: string
    timeZone: string
    description: string
    agenda: boolean
    transcription: boolean
    files : Files[]
    hostVideo: boolean
    participantVideo: boolean
  }

const timeZones = [
  '(GMT-12:00) International Date Line West',
  '(GMT-11:00) Midway Island, Samoa',
  '(GMT-10:00) Hawaii',
  '(GMT-09:00) Alaska',
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-07:00) Mountain Time (US & Canada)',
  '(GMT-06:00) Central Time (US & Canada), Mexico City',
  '(GMT-05:00) Eastern Time (US & Canada), Bogota, Lima',
  '(GMT-04:00) Atlantic Time (Canada), Caracas, La Paz',
  '(GMT-03:30) Newfoundland',
  '(GMT-03:00) Brazil, Buenos Aires, Georgetown',
  '(GMT-02:00) Mid-Atlantic',
  '(GMT-01:00) Azores, Cape Verde Islands',
  '(GMT+00:00) Western Europe Time, London, Lisbon, Casablanca',
  '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
  '(GMT+02:00) Kaliningrad, South Africa',
  '(GMT+03:00) Baghdad, Riyadh, Moscow, St. Petersburg',
  '(GMT+03:30) Tehran',
  '(GMT+04:00) Abu Dhabi, Muscat, Baku, Tbilisi',
  '(GMT+04:30) Kabul',
  '(GMT+05:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
  '(GMT+05:30) Bombay, Calcutta, Madras, New Delhi',
  '(GMT+05:45) Kathmandu',
  '(GMT+06:00) Almaty, Dhaka, Colombo',
  '(GMT+07:00) Bangkok, Hanoi, Jakarta',
  '(GMT+08:00) Beijing, Perth, Singapore, Hong Kong',
  '(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
  '(GMT+09:30) Adelaide, Darwin',
  '(GMT+10:00) Eastern Australia, Guam, Vladivostok',
  '(GMT+11:00) Magadan, Solomon Islands, New Caledonia',
  '(GMT+12:00) Auckland, Wellington, Fiji, Kamchatka'
]


const steps = [
  { id: "basics", name: "Basic Info" },
  { id: "description", name: "Description" },
  { id: "settings", name: "Settings" },
]


export default function ScheduleMeeting() {
  const [currentStep, setCurrentStep] = useState(0)
  const [message, setMessage] = useState<string>()
  const [date, setDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

    return { time: `${hours}:${minutes}`, ampm, rawTime: `${now.getHours()}:${minutes}` };
  };

  const [selectedTime, setSelectedTime] = useState(getCurrentTime());

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hour, minute] = event.target.value.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const convertedHour = hour % 12 || 12;

    setSelectedTime({ time: `${convertedHour}:${minute.toString().padStart(2, "0")}`, ampm, rawTime: event.target.value });
  };



  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(filesArray)
    }
  }

  async function onSubmit(formData: FormData) {
    try {

      setIsLoading(true)
      const uploadedFiles: { type: string ; url: string }[] = [];

     for (const file of selectedFiles) {

        const response = await uploadFileTos3(file);

        const formattedData = {
          type: file.type,
          url: response?.url || "",
        };

        uploadedFiles.push(formattedData);
      }

      const input: SchedulerInput = {
        topic: formData.get('topic') as string,
        date: date as Date,
        time: `${selectedTime.time} ${selectedTime.ampm}`,
        duration: formData.get('duration') as string,
        timeZone: formData.get('timeZone') as string,
        description: formData.get('description') as string,
        agenda: formData.get('agenda') === 'on',
        files:uploadedFiles,
        transcription: formData.get('transcription') === 'on',
        hostVideo: formData.get('hostVideo') === 'on',
        participantVideo: formData.get('participantVideo') === 'on',
      }


      const response = await fetch("/api/save-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: input,
        })
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to schedule meeting")
      }
  
      setMessage(result.message)
     
      setMessage(result.message as string)
      router.push('/i/meeting')
    } catch (error) {
      console.error(error)
      
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  if (isLoading) {
    return <LoadingState />
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }
  return (
    <div className=" flex items-center justify-start p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" overflow-hidden max-w-4xl w-full"
      >

        <div className="p-6">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-100 text-green-700 rounded-md"
            >
              {message}
            </motion.div>
          )}

          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className={cn(stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "", "relative")}>
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                        stepIdx <= currentStep ? "bg-indigo-600" : "bg-gray-300",
                      )}
                    >
                      <span className="text-white text-sm">{stepIdx + 1}</span>
                    </div>
                    <div className="ml-4 sm:ml-8">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          stepIdx <= currentStep ? "text-indigo-600" : "text-gray-500",
                        )}
                      >
                        {step.name}
                      </p>
                    </div>
                  </div>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className={cn(
                        "absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5",
                        stepIdx < currentStep ? "bg-indigo-600" : "bg-gray-300",
                      )}
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </nav>

          <form action={onSubmit} className="mt-8 space-y-6">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={cn("space-y-4", {
                  hidden: currentStep !== 0,
                })}
              >
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Enter the subject or title of the meeting (e.g., Team Standup or Project Discussion).
                  </p>
                  <Input
                    className="bg-transparent border border-blue-500 rounded-full p-5"
                    type="text"
                    id="topic"
                    name="topic"
                    required
                    defaultValue="My Meeting"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Select the date when the meeting will take place.
                    </p>
                    <Popover>
                      <PopoverTrigger
                        className="bg-transparent border border-blue-500 rounded-full p-5"
                        asChild
                      >
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full rounded-3xl justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar disabled={isPastDate} mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Specify the start time for the meeting (e.g., 12:00 PM).
                    </p>
                    <input
                      className="bg-transparent border border-blue-500 rounded-full p-2 text-center"
                      type="time"
                      id="time"
                      name="time"
                      required
                      value={selectedTime.rawTime} // Store value in 24-hour format
                      onChange={handleTimeChange} // Convert it to 12-hour format with AM/PM
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Choose the length of the meeting (e.g., 30 minutes, 1 hour).
                    </p>
                    <Select name="duration" defaultValue="60">
                      <SelectTrigger className="bg-transparent border border-blue-500 rounded-full p-5">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[15, 30, 45, 60, 90, 120, 180, 240].map((minutes) => (
                          <SelectItem key={minutes} value={minutes.toString()}>
                            {minutes} minutes
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Select the time zone of the meeting participants.
                    </p>
                    <Select name="timeZone" defaultValue="(GMT-08:00) Pacific Time (US & Canada)">
                      <SelectTrigger className="bg-transparent border border-blue-500 rounded-full p-5">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeZones.map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>


              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={cn("space-y-4",{
                  'hidden':currentStep !== 1
                })}
              >
                <div>
                  <Label htmlFor="description">description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="bg-transparent border border-blue-500  rounded-full p-5"
                    placeholder="Describe whats all about"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="agenda" name="agenda" />
                  <Label htmlFor="agenda">Agenda Outline</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="transcription" name="transcription" />
                  <Label htmlFor="waitingRoom">Enable transcription</Label>
                </div>
              </motion.div>
    
              <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-4", {
        hidden: currentStep !== 2,
      })}
    >
      <div>
        <Label htmlFor="fileUpload">Upload Files</Label>
        <div className="relative">
          <label
            htmlFor="fileUpload"
            className="flex items-center justify-between bg-transparent border border-blue-500 rounded-full p-5 w-full cursor-pointer"
          >
            <span className="text-sm text-gray-500">
              {selectedFiles.length > 0
                ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
                : "Select files..."}
            </span>
            <Upload className="h-5 w-5 text-blue-500" />
          </label>
          <input
            type="file"
            id="fileUpload"
            name="fileUpload"
            multiple
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            <p>Selected files:</p>
            <ul className="list-disc pl-5">
              {selectedFiles.map((file, index) => (
                <li key={index} className="truncate">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
      {/* <div>
          <Label htmlFor="muteAudio">Mute Audio</Label>
          <Select name="muteAudio" defaultValue="off">
            <SelectTrigger className="bg-transparent border border-blue-500 rounded-full p-5">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        <div>
          <Label htmlFor="muteAudio">Mute Audio</Label>
          <Select name="muteAudio" defaultValue="off">
            <SelectTrigger className="bg-transparent border border-blue-500 rounded-full p-5">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on">On</SelectItem>
              <SelectItem value="off">Off</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="muteVideo">Mute Video</Label>
          <Select name="muteVideo" defaultValue="off">
            <SelectTrigger className="bg-transparent border border-blue-500 rounded-full p-5">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on">On</SelectItem>
              <SelectItem value="off">Off</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
      </div>
    </motion.div>

            <div className="flex justify-between pt-4">
              <Button className="rounded-3xl bg-green-500" type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentStep < steps.length - 1 && (
                <Button className="rounded-3xl bg-green-500" type="button" onClick={nextStep}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {steps[currentStep].id === 'settings' && 
               <Button disabled={isLoading} className="rounded-3xl bg-green-500" type="submit">
                
                {isLoading ? <Dot className='animate-fade-in text-green-500' /> : 'Schedule Meeting'}
                <Clock className="w-4 h-4 ml-2" />
             </Button>
             }
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}


