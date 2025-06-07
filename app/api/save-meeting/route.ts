
import { prisma } from "@/lib/db"
import { getUser } from "@/lib/user"
import type { SchedulerInput } from "@/components/meeting/schedule/ScheduleMeeting"
import { type NextRequest, NextResponse } from "next/server"

const convertTo24HourFormat = (time12h: string) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user || !user.id) {
      return NextResponse.json({ message: "User not authenticated or missing." }, { status: 401 })
    }

    // Parse request body
    const { formData } = await request.json()

    // Convert form data to input object
    const input: SchedulerInput = {
      topic: formData.topic,
      date: formData.date, // This will be a string when received from JSON
      time: formData.time,
      files: formData.files || [],
      duration: formData.duration,
      timeZone: formData.timeZone,
      description: formData.description,
      agenda: formData.agenda === "on" || formData.agenda === true,
      transcription: formData.transcription === "on" || formData.transcription === true,
      hostVideo: formData.hostVideo === "on" || formData.hostVideo === true,
      participantVideo: formData.participantVideo === "on" || formData.participantVideo === true,
    }

    // Validate required fields
    if (!input.topic || !input.date || !input.time || !input.duration || !input.timeZone) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Parse duration to number
    const duration = Number.parseInt(input.duration, 10)
    if (isNaN(duration)) {
      return NextResponse.json({ message: "Invalid duration" }, { status: 400 })
    }

    const extractedDate = new Date(input.date).toISOString().split("T")[0];

// Convert time before creating a Date
    const convertedTime = convertTo24HourFormat(input.time);
    const startDateTime = new Date(`${extractedDate}T${convertedTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
 
    // Create the meeting
    const meeting = await prisma.meeting.create({
      data: {
        topic: input.topic,
        startTime:startDateTime,
        duration,
        endDate:endDateTime,
        startDate:input.date,
        timeZone: input.timeZone,
        description: input.description || "",
        muteVideo: input.hostVideo,
        muteAudio: input.participantVideo,
        agenda: input.agenda,
        transcription: input.transcription,
        host: {
          connect: {
            id: user.id,
          },
        },
      },
    })

    // // Handle file associations if files exist
    if (input.files.length > 0) {
      // Create file records one by one

      for (const file of input.files){

        await prisma.files.create({
          data:{
            uploder: user.name as string,
            name: file.url,
            type:file.type,
            url:file.url,
            meeting:{
              connect:{
                id:meeting.id
              }
            }
          }
        })
      
      }     

    }

    return NextResponse.json({
      message: "Meeting scheduled successfully!",
      //meetingId: meeting.id,
    })
  } catch (error) {
    console.error("Error scheduling meeting:", error)
    return NextResponse.json({ message: "Error scheduling meeting. Please try again." }, { status: 500 })
  }
}



