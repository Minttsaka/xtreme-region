'use server';

import { prisma } from '@/lib/db';
import { getUser } from '@/lib/user';
import { revalidatePath } from 'next/cache';
import { NewLesson, SelectedResource } from '@/types/course';
import { AccessLevel } from '@/types/course';
// ...
 
type SchedulerInput = {
  topic: string
  date: Date | undefined
  time: string
  duration: string
  timeZone: string
  description: string
  recurring: boolean
  transcription: boolean
  files?:File[]
  hostVideo: boolean
  participantVideo: boolean
}

type SchedulerResult = {
  message: string
}

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

export const lessonMeetingSchedule = async ( newMeeting:LessonMeeting ) => {

  const user = await getUser()

  try {

    const { lessonId, ...formattedData } = newMeeting

    const existLesson = await prisma.lesson.findUnique({
      where:{
        id:lessonId
      }
    })

    if(!existLesson || !user){
      throw new Error("No lesson found for that id")
    }

    
    await prisma.meeting.create({
      data: {
        ...formattedData,
        timeZone:'(GMT-08:00) Pacific Time (US & Canada)',
        host:{
          connect:{
            id:user.id
          }
        },
        type:"LESSON",
        lesson:{
          connect:{
            id:existLesson.id
          }
        }
      }
    })

     
  } catch (error) {
    console.log(error)    
  }
}

export async function scheduler(formData: FormData, date: Date | undefined, selectedFiles : {
  type:string,
  name: string,
  url: string
}[]): Promise<SchedulerResult> {

  const user = await getUser()
  
  try {
    const input: SchedulerInput = {
      topic: formData.get('topic') as string,
      date,
      time: formData.get('time') as string,
      duration: formData.get('duration') as string,
      timeZone: formData.get('timeZone') as string,
      description: formData.get('description') as string,
      recurring: formData.get('recurring') === 'on',
      transcription: formData.get('transcription') === 'on',
      hostVideo: formData.get('hostVideo') === 'on',
      participantVideo: formData.get('participantVideo') === 'on',
    }

    if (!user) {
      throw new Error("User not authenticated or missing.");
    }


    // Validate required fields
    if (!input.topic || !input.date || !input.time || !input.duration || !input.timeZone) {
      throw new Error('Missing required fields')
    }

    // Parse duration to number
    const duration = parseInt(input.duration, 10)
    if (isNaN(duration)) {
      throw new Error('Invalid duration')
    }

    // Combine date and time
    const startTime = new Date(`${input.date.toISOString().split("T")[0]}T${input.time}`);

    // Create the meeting
    const meeting = await prisma.meeting.create({
      data: {
        topic: input.topic,
        startTime,
        duration,
        timeZone: input.timeZone,
        description: input.description,
        muteVideo: input.hostVideo,
        muteAudio: input.participantVideo,
        recurring: input.recurring,
        transcription:input.transcription,
        host:{
          connect:{
            id:user.id
          }
        }
      }
    })

    if (input.files) {
    
      for (const file of selectedFiles) {
   
        await prisma.files.create({
          data: {
            uploder : user.name as string,
            name:file.name,
            url:file.url,
            type: file.type,
            meeting:{
              connect:{
                id:meeting.id
              }
            }
          } 
        })
      }
    }

    return { message: 'Meeting scheduled successfully!' }
  } catch (error) {
    console.log('error:', error)
    console.error('Error scheduling meeting:', error)
    return { message: 'Error scheduling meeting. Please try again.' }
  }
}

export const dltMeeting = async (
  id:string,
) => {

  try {

    const existMeet = await prisma.meeting.findFirst({
      where:{
        id
      }
    })

    if(!existMeet){
      return "No meeting found"
    }
    
    await prisma.meeting.delete({
      where:{
        id:existMeet.id
      },
      include:{
        files:true
      }
    })
  } catch (error) {
    console.log(error)
    
  }
}

export const saveNewLesson = async (course:NewLesson, courseId:string) => {

  const user = await getUser()

  const {resources, ...refinedCourse} = course
  try {

    const mappedCourse = await prisma.userCourse.findUnique({
      where:{
        id:courseId
      }
    })
    const newLesson = await prisma.lesson.create({
      data: {
        ...refinedCourse,
        user:{
          connect:{
            id:user?.id
          }
        },
        course:{
          connect:{
            id: mappedCourse?.id
          }
        }

    }
    })

    if((resources as Set<SelectedResource>).size){
      Array.from(resources).map(async (resource)=>{
        await prisma.lessonToResource.create({
          data:{
            lesson:{
              connect:{
                id:newLesson.id
              }
            },
            resource:{
              connect:{
                id:resource.id
              }
            }
          }
        })
      })
    }

    return { success: true, data: newLesson };
  } catch (error) {
    console.error("Error saving course settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}


export async function updateChannel(channelId: string, data: { name?: string; description?: string | null; isActive?: boolean }) {
  
  const user = await getUser()

  if (!user?.email) {
    throw new Error("Not authenticated")
  }
  
  const userData = await prisma.user.findUnique({
    where: { email: user.email },
    include: { channels: true }
  })
  
  if (!userData) {
    throw new Error("User not found")
  }
  
  // Check if the channel belongs to the user
  const userChannel = userData.channels.find(channel => channel.id === channelId)
  
  if (!userChannel) {
    throw new Error("Channel not found or doesn't belong to the user")
  }
  
  const updatedChannel = await prisma.channel.update({
    where: { id: channelId },
    data
  })
  
  revalidatePath('/channel')
  return updatedChannel
}

type AddCourseParams = {
  courseId: string
  channelId: string
  title: string
  subjectId:string
  content: string | null
  thumbnail: string | null
  startDate: Date
  duration: number
}

export async function addCourseToUser(data: AddCourseParams) {

  try {

    const user = await getUser()
  
    const { 
      courseId, 
      title, 
      thumbnail, 
      subjectId, 
      content, 
      channelId, 
      startDate, 
      duration } = data

    // Validate required fields
    if (!courseId ||!title || !channelId || !startDate) {
      throw new Error('no coure') 
    }

    const channel = await prisma.channel.findUnique({
      where: {
        id:channelId
      }
    })

    const course = await prisma.course.findUnique({
      where: {
        id:courseId
      }
    })

    if(!channel || !course ||!user){

      throw new Error('no course')
    }


    // Check if the user already has this course
    const existingUserCourse = await prisma.userCourse.findFirst({
      where: {
        courseId,
        channel: {
          userId:user.id
        }
      }
    })

    if (existingUserCourse) {
      throw new Error('exst')
    }

    const existingsubject = await prisma.subjectToClass.findUnique({
    where: {
      id:subjectId
    }
  })

  if (!existingsubject) {
    throw new Error('no sebject')
  }


    // Create the UserCourse
    const userCourse = await prisma.userCourse.create({
      data: {
        course:{
          connect:{
            id:course?.id
          }
        },
        subjectToClass:{
          connect:{
            id:existingsubject?.id
          }
        },
        title,
        thumbnail,
        content,
        accessLevel:"PUBLIC",
        channel:{
          connect:{
            id:channel?.id
          }
        },
        startDate: new Date(startDate),
        duration: duration || 60,
        participants: 1, // Starting with 1 participant (the user)
      }
    })

    const justAddedCourse = await prisma.userCourse.findUnique({
      where:{
        id: userCourse.id
      },
      include:{
        subjectToClass:{
          include:{
            subject:{
              include:{
                resource:true,
                }
            }
          }
        }
      }
    })

    if(!justAddedCourse){
      throw new Error('no that  courest')
    }


  } catch (error) {
    console.error('Error creating user course:', error)
    
  }
}

export const fetchCourses = async (id: string) => {

   if(!id){
    return
  }

  const existingsubject = await prisma.subjectToClass.findUnique({
    where: {
      id
    }
  })


  if (!existingsubject) {
    return 
  }
 
  try {
   
    const courses = await prisma.userCourse.findMany({
      where: {
          subjectToClassId: existingsubject.id, 
      },
      include: {
        review:{
          include:{
            user:true,
            reviewLike:true
          }
        },
        notification:true,
        course: true,
        enrollment:{
        include:{
          user:{
                include:{
                    completeArena:true
                }
            }
        }
      },
        lessons:{
          include:{
            resources:{
              include:{
                resource:true
              }
            }
          }
        }
      },
    });


    return courses; 
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    // return null;
  }
};

export interface Note {
  content: string;
  type: 'text' | 'image' | 'video';
  source?: string;
}

export interface Slide {
  title:string;
  notes: Note[];
}

export async function getAgenda(meetingId: string) {

  if(!meetingId){
    throw new Error('there is no meeting id')
  }

  try {
    const dbSlides = await prisma.agendaItem.findMany({
      where: { meetingId },
    })
    
    return dbSlides

  } catch (error) {
    console.error("Failed to load slides:", error)
    return []
  }
}

export async function transcribeAudio(formData: FormData) {
  try {
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return { error: "No audio file provided" }
    }

    // Convert the file to a Buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create form data for OpenAI API
    const form = new FormData()
    form.append("file", new Blob([buffer]), "audio.wav")
    form.append("model", "whisper-1")

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: form,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("OpenAI API error:", errorData)
      return { error: `OpenAI API error: ${errorData.error?.message || "Unknown error"}` }
    }

    const data = await response.json()
    return { transcript: data.text }
  } catch (error) {
    console.error("Error transcribing audio:", error)
    return { error: "Failed to transcribe audio" }
  }

 
}

export async function acceptCourseInvitation(
  course:string,
) {
  try {

    const user = await getUser()


    if(!user){
      throw  new Error('no user foound')
    }

    const collaboration = await prisma.collaborators.findFirst({
      where:{
        userId:user.id,
        courseId:course
      }
    })

    if(!collaboration){
      return {
        error:true,
        status:"You were not invited"
      }
    }

    await prisma.collaborators.updateMany({
      where:{
        userId:user.id,
        courseId:course
      },
      data:{
        status:"accepted"
      }
    })








    // Revalidate paths
    revalidatePath(`/i/invite-collaboration/${course}`)
    revalidatePath(`/i/meetings/${course}`)

    return {
      error:false,
      status:"Successfully accepted collaboration"
    }
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return { success: false, error: "Failed to accept invitation" }
  }
}

export async function acceptInvitation(
  userId:string,
  meetingId:string,
) {
  try {

    const user = await prisma.user.findUnique({
      where: {
        id:userId,
      },
    })

    if(!user){
      throw  new Error('no user foound')
    }

    const collaboration = await prisma.collaborators.findFirst({
      where:{
        userId:user.id,
        meetingId
      }
    })

    if(!collaboration){
      return {
        error:true,
        status:"You were not invited"
      }
    }

    await prisma.collaborators.updateMany({
      where:{
        userId:user.id,
        meetingId
      },
      data:{
        status:"accepted"
      }
    })
    // Revalidate paths
    revalidatePath(`/i/invite-collaboration/${meetingId}`)
    revalidatePath(`/i/meetings/${meetingId}`)

    return {
      error:false,
      status:"Successfully accepted collaboration"
    }
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return { success: false, error: "Failed to accept invitation" }
  }
}


export const editCourse = async (id :string, title:string, content:string) => {

try {

    await prisma.userCourse.update({
      where:{
        id
      },
      data:{
        title,
        content
      }
    })

    
    
  } catch (error) {
    console.error("Error updating course:", error)
    
  }
}


export const editAccessLevelCourse = async (id:string, accessLevel:AccessLevel, price:string) => {

  try {

    await prisma.userCourse.update({
      where:{
        id
      },
      data:{
       amount:Number(price),
       accessLevel
      }
    })

    
    
  } catch (error) {
    console.error("Error updating course:", error)
    
  }
}




