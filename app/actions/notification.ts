"use server"

import { prisma } from "@/lib/db"
import { getUser } from "@/lib/user"
import { CreateNotificationData } from "@/types/notification"
import { revalidatePath } from "next/cache"

export type ActionResult = {
  success: boolean
  message: string
  data?: unknown
  errors?: Record<string, string[]>
}

export async function createNotification(data: CreateNotificationData): Promise<ActionResult> {

     const user = await getUser()
  
    try {
    // Validate required fields
    const errors: Record<string, string[]> = {}

    if (!data.title?.trim()) {
      errors.title = ["Title is required"]
    } else if (data.title.length > 200) {
      errors.title = ["Title must be less than 200 characters"]
    }

    if (!data.content?.trim()) {
      errors.content = ["Content is required"]
    } else if (data.content.length > 5000) {
      errors.content = ["Content must be less than 5000 characters"]
    }
    // Check if there are validation errors
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Validation failed",
        errors,
      }
    }


    if (!user) {
      return {
        success: false,
        message: "Author not found",
        errors: { authorId: ["Invalid author ID"] },
      }
    }


    const course = await prisma.userCourse.findUnique({
        where:{
            id:data.courseId
        }
    })

    if(!course){
        return {
          success: false,
          message: "Course not found",
          errors: { courseId: ["Invalid course ID"] },
        }
    }

    // Create the notification
    const notification = await prisma.notification.create({
      data: {
        title: data.title.trim(),
        content: data.content.trim(),
        priority: data.priority,
        isPinned: data.isPinned,
        category: data.category,
        targetedAudience: data.targetedAudience,
        author: {
            connect:{
                id:user.id
            }
        },
        course:  {
            connect:{
                id:course.id
            }
        }
        ,
      },
    })

    // Revalidate the page to show the new notification
    revalidatePath("/dashboard")
    revalidatePath("/course")

    return {
      success: true,
      message: "Notification created successfully",
      data: notification,
    }
  } catch (error) {
    console.error("Error creating notification:", error)
    return {
      success: false,
      message: "Failed to create notification. Please try again.",
    }
  }
}

export async function getNotifications(courseId?: string, limit = 10): Promise<ActionResult> {
  try {
    const notifications = await prisma.notification.findMany({
      where: courseId ? { courseId } : {},
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: limit,
    })

    return {
      success: true,
      message: "Notifications retrieved successfully",
      data: notifications,
    }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return {
      success: false,
      message: "Failed to fetch notifications",
    }
  }
}

export async function markNotificationAsViewed(notificationId: string, userId: string): Promise<ActionResult> {
  try {
    // Check if already viewed
    const existingView = await prisma.notificationView.findFirst({
      where: {
          notificationId,
          userId,
      },
    })

    if (existingView) {
      return {
        success: true,
        message: "Already marked as viewed",
      }
    }

    // Create view record
    await prisma.notificationView.create({
      data: {
        notificationId,
        userId,
      },
    })

    return {
      success: true,
      message: "Notification marked as viewed",
    }
  } catch (error) {
    console.error("Error marking notification as viewed:", error)
    return {
      success: false,
      message: "Failed to mark notification as viewed",
    }
  }
}
