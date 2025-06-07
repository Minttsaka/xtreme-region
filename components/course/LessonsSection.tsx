"use client"
import { LessonCard } from "./LessonCard"
import { Badge } from "@/components/ui/badge"
import { Prisma } from '@prisma/client'

type Course = Prisma.UserCourseGetPayload<{
  include: {
    course: true,
    lessons:{
      include:{
        resources:true
      }
    }
  },
}>

export function LessonsSection({ course }:{course:Course}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">{course.title}</h2>
            <Badge variant="secondary">
            {course.lessons.length} {course.lessons.length === 1 ? 'lesson' : 'lessons'}
            </Badge>
          </div>
          {course.content && (
            <p className="text-muted-foreground">{course.content}</p>
          )}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {course.lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  )
}

