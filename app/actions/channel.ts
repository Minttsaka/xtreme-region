"use server"

import { auth } from "../authhandlers/auth"
import { prisma } from "@/lib/db"
import { getUser } from "@/lib/user"
import { revalidatePath } from "next/cache"
import { z } from "zod"


export async function createChannel( name:string, description:string, image:string | null ) {

  const user = await getUser()
  
  if (!user?.email) {
    throw new Error("Not authenticated")
  }
  
  const userData = await prisma.user.findUnique({
    where: { email: user.email }
  })
  
  if (!userData) {
    throw new Error("User not found")
  }
  
  if (!name) {
    throw new Error("Channel name is required")
  }
  
  const channel = await prisma.channel.create({
    data: {
      name,
      thumbnail:image,
      isActive:false,
      description,
      user:{
        connect:{
          id:user.id
        }
      }
     
    }
  })
  
  revalidatePath('/channel')
  return channel
}


export async function getChannelStats(channelId: string) {

  const user = await getUser()
  
  if (!user?.id) {
    throw new Error("You must be logged in to view channel stats")
  }

  try {
    // First check if the channel belongs to the user
    const existingChannel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { userId: true },
    })

    if (!existingChannel || existingChannel.userId !== user.id) {
      throw new Error("You do not have permission to view this channel")
    }

    // In a real application, you would fetch actual stats from your database
    // For now, we'll return mock data
    return {
      views: 10000,
      likes: 5000,
      comments: 2000,
      lessonsCount: 25,
      revenue: 5000,
      students: 500,
      averageWatchTime: 15,
    }
  } catch (error) {
    console.error("Error fetching channel stats:", error)
    throw new Error("Failed to fetch channel stats")
  }
}

export async function getUserChannel() {

  const session = await auth()
  const sessionUser = session?.user

  
  if (!sessionUser?.email) {
    throw new Error("Not authenticated")
  }
  
  const userData = await prisma.user.findUnique({
    where: { email: sessionUser.email },
      include: { 
        channels: {
          include:{
            courses:{
              include:{
                lessons:true
              }
            }
          }
      } 
    }
  })
  
  if (!userData) {
    throw new Error("userData not found")
  }
  
  // Return the first channel or null if none exists
  return userData.channels[0] || null
}


export const likeToChannel = async (channelId: string) => {

  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const channel = await prisma.channel.findUnique({ 
    where: {
      id: channelId,
    },
  })
  if (!channel) {
    throw new Error("Channel not found")
    
  }

  const existingLike = await prisma.like.findFirst({
    where:{
      userId:user.id,
      channelId:channel.id
    }
  })

  if(!existingLike){
    const like = await prisma.like.create({
    data: {
      user:{
        connect: {
          id: user.id,
        },
      },
    channel:{
        connect: {
        id: channel.id,
        },
    },
    },
  })
  return like
  } else{
    await prisma.like.deleteMany({
    where:{
      userId:user.id,
      channelId:channel.id
    }
  })
  }
  

 
}

export const likeToCourse = async (courseId: string) => {

  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const course = await prisma.userCourse.findUnique({ 
    where: {
      id: courseId,
    },
  })
  if (!course) {
    throw new Error("course not found")
  }
  const like = await prisma.like.create({
    data: {
      user:{
        connect: {
          id: user.id,
        },
      },
    course:{
        connect: {
        id: course.id,
        },
    },
    },
  })

  return like
}

export const unlikeFromCourse = async (courseId: string) => {
  "use server"
  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({   
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const course = await prisma.userCourse.findUnique({
    where: {
      id: courseId,
    },
  })
  if (!course) {
    throw new Error("course not found")
  }
  const like = await prisma.like.deleteMany({
    where: {
      userId: user.id,
      courseId: course.id,
    },
  })

  return like
}

export const unlikeFromChannel = async (channelId: string) => {
  "use server"
  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({   
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  })
  if (!channel) {
    throw new Error("Channel not found")
  }
  const like = await prisma.like.deleteMany({
    where: {
      userId: user.id,
      channelId: channel.id,
    },
  })

  return like
}

export const addViewToChannel = async (userId : string | undefined, channelId: string) => {

  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const channel = await prisma.channel.findUnique({ 
    where: {
      id: channelId,
    },
  })
  if (!channel) {
    throw new Error("Channel not found")
  }


  if(userId){

    await prisma.view.deleteMany({
    where:{
      id:user.id
    }
  })
  
  const view = await prisma.view.create({
    data: {
      user:{
        connect: {
          id: user.id,
        },
      },
    channel:{
        connect: {
        id: channel.id,
        },
    },
    },
  })


  return view
} else {

  const users = await prisma.user.findMany()

  const randomUser = users[Math.floor(Math.random() * users.length)];


  if(!randomUser){
    return
  }

  const view = await prisma.view.create({
    data: {
      user:{
        connect: {
          id: randomUser.id,
        },
      },
    channel:{
        connect: {
        id: channel.id,
        },
    },
    },
  })

  
  return view

}
}

export const addViewToCourse = async (userId : string | undefined, courseId: string) => {

  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const course = await prisma.userCourse.findUnique({ 
    where: {
      id: courseId,
    },
  })
  if (!course) {
    throw new Error("course not found")
  }


  if(userId){

    await prisma.view.deleteMany({
    where:{
      id:user.id
    }
  })
  
  const view = await prisma.view.create({
    data: {
      user:{
        connect: {
          id: user.id,
        },
      },
    course:{
        connect: {
        id: course.id,
        },
    },
    },
  })

  
  return view
} else {

  const users = await prisma.user.findMany()

  const randomUser = users[Math.floor(Math.random() * users.length)];


  if(!randomUser){
    return
  }

  const view = await prisma.view.create({
    data: {
      user:{
        connect: {
          id: randomUser.id,
        },
      },
    channel:{
        connect: {
        id: course.id,
        },
    },
    },
  })

  
  return view

}
}

export const handleEnrollToCourse = async (courseId: string) => {

  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const course = await prisma.userCourse.findUnique({ 
    where: {
      id: courseId,
    },
  })
  if (!course) {
    throw new Error("course not found")
  }

  const existingSubscription = await prisma.subscription.findFirst({
    where:{
      userId:user.id,
      courseId:course.id
    }
  })

  if(existingSubscription){
    return({
      status:true,
      data:existingSubscription
    })
  }
  const subscription = await prisma.subscription.create({
    data: {
      user:{
        connect: {
          id: user.id,
        },
      },
    course:{
        connect: {
        id: course.id,
        },
    },
    },
  })

  revalidatePath(`/channels/course/${course.id}`)

  if(subscription){
    return({
      status:true,
      data:subscription
    })
  }
}

export const subscribeToChannel = async (channelId: string) => {

  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const channel = await prisma.channel.findUnique({ 
    where: {
      id: channelId,
    },
  })
  if (!channel) {
    throw new Error("Channel not found")
  }
  const subscription = await prisma.subscription.create({
    data: {
      user:{
        connect: {
          id: user.id,
        },
      },
    channel:{
        connect: {
        id: channel.id,
        },
    },
    },
  })

  console.log("subscribe", subscription)

  return subscription
}
export const unsubscribeFromChannel = async (channelId: string) => {
  "use server"
  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({   
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  })
  if (!channel) {
    throw new Error("Channel not found")
  }
  const subscription = await prisma.subscription.deleteMany({
    where: {
      userId: user.id,
      channelId: channel.id,
    },
  })

   console.log("unsubscribe", subscription)
 
  
  return subscription
}

export const saveCompletedSlide = async (slideId: string) => {
  "use server"
  const session = await auth()
  const sessionUser = session?.user
  const user = await prisma.user.findUnique({   
    where: {
      email: sessionUser?.email as string,
    },
  })
  if (!user) {
    throw new Error("User not found")
  }
  const slide = await prisma.slide.findUnique({
    where: {
      id: slideId,
    },
  })
  if (!slide) {
    throw new Error("Channel not found")
  }
  await prisma.completeArena.create({
   data: {
    type:"SLIDE",
    level:"COMPLETED",
      user: {
        connect: {
          id: user.id,
        },
      },
      finalSlide: {
        connect: {
          id: slide.id,
        },
      },
    },
  })
  
  return true
}

export async function updateCourseImage(courseId:string, imageUrl: string) {
  "use server";
    const sessionUser = await getUser();
    if (!sessionUser) {
      throw new Error("You must be logged in to update your profile image.");
    }
    const updatedCourse = await prisma.userCourse.update({
      where: { id: courseId },
      data: {
        thumbnail: imageUrl,
      },
    });

    return updatedCourse.thumbnail;
}

export async function updateChannelImage(channelId:string, imageUrl: string) {
  "use server";
    const sessionUser = await getUser();
    if (!sessionUser) {
      throw new Error("You must be logged in to update your profile image.");
    }
    const updatedCourse = await prisma.channel.update({
      where: { id: channelId },
      data: {
        thumbnail: imageUrl,
      },
    });

    return updatedCourse.thumbnail;
}


export async function createReview(data: {
  courseId: string,
  rating: number,
  content: string,
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" }
    }

    const { courseId, ... refinedData  } = data
    const review = await prisma.review.create({
      data: {
        ...refinedData,
        user:{
          connect:{
            id:session.user.id,
          }
        },
        course:{
          connect:{
            id:courseId,
          }
        },

      },
      include: {
        user:true,
        reviewLike:true,
      },
    })

    // Update course average rating
    await updateCourseRating(data.courseId)

    revalidatePath(`/channels/course/${data.courseId}`)
    return { success: true, data: review }
  } catch (error) {
    console.error("Create review error:", error)
    return { success: false, error: "Failed to create review" }
  }
}

export async function toggleReviewLike(reviewId: string, type: 'HELPFUL' | 'UNHELPFUL') {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" }
    }

    const existingLike = await prisma.reviewLike.findFirst({
      where: {
          userId: session.user.id,
          reviewId,
      },
    })

    if (existingLike) {
      if (existingLike.type === type) {
        // Remove like if same type
        await prisma.reviewLike.delete({
          where: { id: existingLike.id },
        })
      } else {
        // Update like type
        await prisma.reviewLike.update({
          where: { id: existingLike.id },
          data: { type },
        })
      }
    } else {
      // Create new like
      await prisma.reviewLike.create({
        data: {
          userId: session.user.id,
          reviewId,
          type,
        },
      })
    }

    // Update helpful count
    const helpfulCount = await prisma.reviewLike.count({
      where: {
        reviewId,
        type: 'HELPFUL',
      },
    })

    await prisma.review.update({
      where: { id: reviewId },
      data: { helpfulCount },
    })

    revalidatePath(`/courses`)
    return { success: true }
  } catch (error) {
    console.error("Toggle like error:", error)
    return { success: false, error: "Failed to update like" }
  }
}

async function updateCourseRating(courseId: string) {
  const stats = await prisma.review.aggregate({
    where: { courseId },
    _avg: { rating: true },
    _count: { id: true },
  })

  await prisma.userCourse.update({
    where: { id: courseId },
    data: {
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count.id,
    },
  })
}

export async function getreviews(
  courseId: string,
  filters: {
    rating?: number
    sortBy?: string
    verifiedOnly?: boolean
    page?: number
    limit?: number
  } = {}
) {
  const { rating, sortBy = 'newest', verifiedOnly, page = 1, limit = 10 } = filters

  const where = {
    courseId,
    isApproved: true,
    ...(rating && { rating }),
    ...(verifiedOnly && { isVerifiedPurchase: true }),
  }

  const orderBy = {
    newest: { createdAt: 'desc' as const },
    oldest: { createdAt: 'asc' as const },
    helpful: { helpfulCount: 'desc' as const },
    rating_high: { rating: 'desc' as const },
    rating_low: { rating: 'asc' as const },
  }[sortBy] || { createdAt: 'desc' as const }

  const reviews = await prisma.review.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          career: true,
        },
      },
      reviewLike: true,
    },
  })

  const total = await prisma.review.count({ where })

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function deleteUserReview(reviewId: string) {
  try {
   
    const review = await prisma.review.delete({
      where:{
        id:reviewId
      }
    })

    return { success: true, id: review.id }
  } catch (error) {
    console.error("Toggle like error:", error)
    return { success: false, error: "Failed to update like" }
  }
}

export async function removethumbPhoto(id:string) {
  try {

    
    // Update the user record to remove profile photo
    await prisma.userCourse.update({
      where: {
        id
      },
      data: {
        thumbnail: null // Set profile image to null
      }
    })
    
    
    return { 
      success: true, 
      message: "Profile photo removed successfully" 
    }
  } catch (error) {
    console.error("Error removing profile photo:", error)
    return { 
      success: false, 
      message: "Failed to remove profile photo" 
    }
  }
}

export async function deleteCourse(courseId: string) {
  try {
    // Get the current user session

    // Find the course to verify ownership
    const course = await prisma.userCourse.findUnique({
      where: {
        id: courseId
      },
    })
    
    // Check if course exists
    if (!course) {
      return { success: false, message: "Course not found" }
    }
    
    // Delete lessons
    await prisma.lesson.deleteMany({
      where: {
        courseId
      }
    })
    
    // Finally delete the course
    await prisma.course.delete({
      where: {
        id: courseId
      }
    })
    
    // Revalidate relevant paths
    revalidatePath('/channel')
     
    return { 
      success: true, 
      message: "Course deleted successfully" 
    }
  } catch (error) {
    console.error("Error deleting course:", error)
    return { 
      success: false, 
      message: "Failed to delete course" 
    }
  }
}
