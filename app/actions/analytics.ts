"use server"

import { revalidatePath } from "next/cache"
import type { AccessLevel,  } from "@prisma/client"
import { getUser } from "@/lib/user"
import { prisma } from "@/lib/db"
import { AnalyticsResponse } from "@/types/analytics"

export type AnalyticsOverview = {
  totalViews: number
  totalParticipants: number
  totalRevenue: number
  avgRating: number
  courses: CourseOverview[]
}

export type CourseOverview = {
  id: string
  title: string
  thumbnail: string | null
  views: number
  participants: number
  revenue: number
  rating: number
}

export type CourseAnalytics = {
  course: {
    id: string
    title: string
    thumbnail: string | null
    startDate: Date
    duration: number
    participants: number
    accessLevel: AccessLevel
    rating: number
  }
  totalViews: number
  viewsChange: number
  participantsChange: number
  engagementRate: number
  engagementChange: number
  totalRevenue: number
  revenueChange: number
  avgCompletionTime: number
  completionRate: number
  viewsData: {
    daily: Array<{ date: string; views: number; uniqueViewers: number }>
    weekly: Array<{ date: string; views: number; uniqueViewers: number }>
    monthly: Array<{ date: string; views: number; uniqueViewers: number }>
  }
  likesData: Array<{ date: string; count: number }>
  commentsData: Array<{ date: string; count: number }>
  participantsData: Array<{ date: string; participants: number; completions: number }>
  revenueData: Array<{ date: string; revenue: number }>
  accessLevelData: Array<{ name: string; value: number; color: string }>
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  recentComments: Array<{
    id: string
    userId: string
    userName: string
    userImage?: string
    content: string
    createdAt: Date
    lessonTitle?: string
  }>
}


// View tracking
export async function trackView({
  channelId,
  courseId,
  lessonId,
}: {
  channelId?: string
  courseId?: string
  lessonId?: string
  sessionId?: string
  watchDuration?: number
}) {

  const user = await getUser()
  const userId = user?.id

  try {
    // Create the view record
    await prisma.view.create({
      data: {
        userId: userId || null,
        channelId: channelId || null,
        courseId: courseId || null,
        lessonId: lessonId || null,
      },
    })

    // Revalidate relevant paths
    if (channelId) revalidatePath(`/dashboard/channel/${channelId}`)
    if (courseId) revalidatePath(`/courses/${courseId}`)
    if (lessonId) revalidatePath(`/lessons/${lessonId}`)

    return { success: true }
  } catch (error) {
    console.error("Error tracking view:", error)
    return { success: false, error: "Failed to track view" }
  }
}


// Analytics functions
export async function getChannelAnalytics(channelId: string): Promise<AnalyticsResponse> {
  const user = await getUser()

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to view channel analytics",
    }
  }

  try {
    // Check if the channel belongs to the user
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { userId: true },
    })

    if (!channel || channel.userId !== user.id) {
      return {
        success: false,
        error: "You do not have permission to view analytics for this channel",
      }
    }

    // Get total views
    const totalViews = await prisma.view.count({
      where: { channelId },
    })

    // Get total likes
    const totalLikes = await prisma.like.count({
      where: { channelId },
    })

    // Get total comments
    const totalComments = await prisma.comment.count({
      where: { channelId },
    })

    // Get total subscribers
    const totalSubscribers = await prisma.subscription.count({
      where: {
        channelId,
        status: "ACTIVE",
      },
    })

    // Get subscribers by tier
    const subscribersByTier = await prisma.subscription.groupBy({
      by: ["tier"],
      where: {
        channelId,
        status: "ACTIVE",
      },
      _count: true,
    })

    // Get views over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const viewsOverTime = await prisma.view.groupBy({
      by: ["createdAt"],
      where: {
        channelId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: true,
    })

    return {
      success: true,
      analytics: {
        totalViews,
        totalLikes,
        totalComments,
        totalSubscribers,
        subscribersByTier: subscribersByTier.map((item) => ({
          tier: item.tier,
          _count: item._count,
        })),
        viewsOverTime: viewsOverTime.map((item) => ({
          createdAt: item.createdAt,
          _count: item._count,
        })),
      },
    }
  } catch (error) {
    console.error("Error fetching channel analytics:", error)
    return {
      success: false,
      error: "Failed to fetch channel analytics",
    }
  }
}

// Helper functions for fetching chart data

