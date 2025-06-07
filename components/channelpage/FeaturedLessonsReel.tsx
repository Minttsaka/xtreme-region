"use client"

import { useState, useRef, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, Clock, Eye, Star, Lock, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Lesson } from "@/types/channel"
import Link from "next/link"

interface FeaturedLessonsReelProps {
  title: string
  icon: ReactNode
  lessons: Lesson[]
  gradientFrom: string
  gradientTo: string
}


export function FeaturedLessonsReel({ title, icon, lessons, gradientFrom, gradientTo }: FeaturedLessonsReelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-md bg-${gradientFrom}/10 text-${gradientFrom}`}>{icon}</div>
        <h3 className="text-sm font-medium text-slate-700">{title}</h3>
        <div className={`h-px flex-grow bg-gradient-to-r from-${gradientFrom}/20 to-transparent`}></div>
      </div>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5 text-slate-700" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x"
        >
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} gradientFrom={gradientFrom} gradientTo={gradientTo} />
          ))}
        </div>
      </div>
    </div>
  )
}

function LessonCard({
  lesson,
  gradientFrom,
  gradientTo,
}: { lesson: Lesson; gradientFrom: string; gradientTo: string }) {
  const channel = lesson.course.channel

  const totalRatings = lesson._count.rating

  const averageRating =
      totalRatings > 0 ? lesson.rating.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings : 0

  return (
    <Link
      href={`/channels/course/${lesson.course.id}`}
      className="flex-shrink-0 w-[280px] snap-start group"
    >
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900 border-0">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${lesson.thumbnail || "/placeholder.svg?height=400&width=280"})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom}/20 to-${gradientTo}/20`} />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 h-[280px] flex flex-col justify-between text-white">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            {lesson.accessLevel && (
              <Badge className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white border-0 backdrop-blur-sm shadow-lg`}>
                <Lock className="h-3 w-3 mr-1" />
                {lesson.accessLevel}
              </Badge>
            )}
            <Badge className="bg-black/30 backdrop-blur-sm text-white border-white/20">
              <Clock className="h-3 w-3 mr-1" />
              {lesson.duration} min
            </Badge>
          </div>

          {/* Middle Section */}
          <div className="flex-1 flex flex-col justify-end">
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
              {lesson.title}
            </h3>

            {/* Channel info */}
            <div className="flex items-center mb-3">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-full blur-[1px]`} />
                <Avatar className="h-6 w-6 border-2 border-white relative">
                  <AvatarImage src={lesson?.user?.image || "/placeholder.svg"} alt={channel?.name} />
                  <AvatarFallback className={`text-xs bg-gradient-to-br from-${gradientFrom} to-${gradientTo} text-white`}>
                    {channel?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-sm text-white/90 line-clamp-1 ml-2">{channel?.name}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-white/80">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md">
                <Eye className="h-3 w-3" />
                <span>{lesson._count.views || 0} views</span>
              </div>

              {lesson.rating && (
                <div className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-sm px-2 py-1 rounded-md">
                  <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                  <span>{averageRating.toFixed(1)}</span>
                </div>
              )}

              <div className="flex items-center gap-1 bg-blue-500/20 backdrop-blur-sm px-2 py-1 rounded-md">
                <Shield className="h-3 w-3 text-blue-400" />
                <span>{lesson.accessLevel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-${gradientFrom}/20 to-${gradientTo}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Bottom gradient accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
      </div>
    </Link>
  )
}
