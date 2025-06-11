
import { prisma } from "@/lib/db"
import { getUser } from "@/lib/user"
import type { SchedulerInput } from "@/components/meeting/schedule/ScheduleMeeting"
import { type NextRequest, NextResponse } from "next/server"

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
      startTime:formData.startTime,
      files: formData.files || [],
      duration: formData.duration,
      endDate:formData.endDate,
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


 
    // Create the meeting
    const meeting = await prisma.meeting.create({
      data: {
        topic: input.topic,
        startTime:input.startTime,
        duration:input.duration,
        endDate:input.endDate,
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



