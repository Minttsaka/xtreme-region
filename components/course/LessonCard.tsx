import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, PlayCircle, Users2, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { Prisma } from "@prisma/client"
import { LessonScheduler } from "@/components/lessoncreation/LessonScheduler"

type Lesson = Prisma.LessonGetPayload<{
  include:{
      resources:true
    }
}>


export function LessonCard({ lesson }: {lesson:Lesson}) {


  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-xl">
  {/* Decorative elements */}
  <div className="absolute -right-12 -top-12 w-24 h-24 bg-blue-100 rounded-full opacity-70 blur-xl"></div>
  <div className="absolute -left-8 -bottom-8 w-16 h-16 bg-purple-100 rounded-full opacity-70 blur-xl"></div>
  
  {/* Geometric accent */}
  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
    <div className="absolute rotate-45 bg-gradient-to-r from-sky-100 to-indigo-100 w-28 h-28 -top-14 -right-14 opacity-80"></div>
  </div>
  
  <CardHeader className="pb-2 relative z-10">
    <div className="aspect-video relative rounded-xl overflow-hidden backdrop-blur-sm bg-white/40 border border-white/60 shadow-sm">
      {lesson.thumbnail ? (
        <img
          src={lesson.thumbnail || "/placeholder.svg"}
          alt={`${lesson.title} thumbnail`}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <PlayCircle className="h-12 w-12 text-slate-300" />
        </div>
      )}
      
      {/* Futuristic hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-100/80 to-indigo-100/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
        <div className="transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-md"></div>
            <PlayCircle className="h-16 w-16 text-white drop-shadow-lg relative z-10" />
          </div>
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-medium text-sky-600 border border-sky-100 shadow-sm">
        {lesson.status === 'IN_PROGRESS' ? 'In Progress' : 
         lesson.status === 'COMPLETED' ? 'Completed' : 'Not Started'}
      </div>
    </div>
  </CardHeader>

  <CardContent className="space-y-4 relative z-10">
    <div className="space-y-2">
         
      <h3 className="font-semibold text-lg leading-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{lesson.title}</h3>
      
      <p className="text-sm text-slate-500 line-clamp-2">{lesson.description}</p>
    </div>

    <div className="flex items-center gap-4 text-sm text-slate-500">
      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
        <Clock className="h-3.5 w-3.5 text-sky-500" />
        <span>{lesson.duration} mins</span>
      </div>
      {lesson.totalStudents && (
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
          <Users2 className="h-3.5 w-3.5 text-indigo-400" />
          <span>{lesson.totalStudents.toLocaleString()}</span>
        </div>
      )}
    </div>
  </CardContent>

  <CardFooter className="relative z-10 pt-0 block">
    <LessonScheduler lesson={lesson} />
    <Link href={`/editor/${lesson.id}`} className="w-full">
      <Button 
        variant="ghost" 
        className="w-full group/button bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 text-slate-700 border border-white/60 rounded-xl h-11"
      >
        <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent font-medium">Edit</span>
        <div className="relative ml-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full w-5 h-5 flex items-center justify-center group-hover/button:translate-x-1 transition-transform">
          <ChevronRight className="h-3 w-3 text-white" />
        </div>
      </Button>
    </Link>
  </CardFooter>
  
  {/* Futuristic progress indicator */}
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
    <div 
      className="h-full bg-gradient-to-r from-sky-400 to-indigo-400"
      style={{ width: lesson.status === 'COMPLETED' ? '100%' : lesson.status === 'IN_PROGRESS' ? '40%' : '0%' }}
    ></div>
  </div>
</Card>
  )
}

