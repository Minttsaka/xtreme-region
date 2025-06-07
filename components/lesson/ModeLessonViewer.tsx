"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Users,
  Grid3X3,
  CheckCircle2,
  Circle,
  Dot,
  CheckCircle,
  Loader2,
} from "lucide-react"
import {  StudyLesson } from "@/types/channel"
import { SlideContent } from "./dom-content"
import { AIAssistant } from "./ai-assistant"
import { Prisma } from "@prisma/client"
import CourseProgress from "./CourseProgress"
import { cn } from "@/lib/utils"
import { CelebrationModal } from "./CelebrationModal"
import Link from "next/link"

export type CourseUser = Prisma.UserGetPayload<{
   include: {
        completeArena: {
          include: {
            course: true,
            lesson: true,
            finalSlide: true
          }
        }
      }
}>

type Course = Prisma.UserCourseGetPayload<{
  include:{
          lessons:true,
          enrollment:true,
          completeArena:{
            where:{
              type:"LESSON"
            },
            include:{
              lesson:true
            }
          }
        }
}>

type CompleteArena= Prisma.CompleteArenaGetPayload<{
  include:{
    course:true
  }
}>

export default function LessonViewer({
    lesson,
    user,
    course
  }: { 
  lesson: StudyLesson,
    user: CourseUser | null ,
    course: Course
  }
) {

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [showSlideGrid, setShowSlideGrid] = useState(false)
  const [completedCourses, setCompletedCourses] = useState<Set<string | undefined>>(new Set())
  const [completedSlides, setCompletedSlides] = useState<Set<string>>(new Set(["slide_1"]))
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState< 'lesson' | 'course'>("lesson")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    if (user?.completeArena) {
      addCourseIds(user?.completeArena);
    }
  },[])

  // Count completed lessons for this specific course
const completedLessonsCount = course.lessons.filter(lesson => 
  completedLessons.has(lesson.id)
).length

const completionPercentage = Math.min(
  100,
  Math.round(
    (completedLessonsCount / (course.lessons.length || 1)) * 100
  )
)

  const currentSlide = lesson.finalSlide[currentSlideIndex]
  const progress = ((currentSlideIndex + 1) / lesson.finalSlide.length) * 100

  const isLessonCompleted = lesson.finalSlide.every(slide => completedSlides.has(slide.id))

  const isCourseCompleted = course.lessons.every(lessonItem => completedLessons.has(lessonItem.id))

  // Load completed slides and lessons on component mount
    useEffect(() => {
      loadUserProgress()
    }, [lesson.id, course.id])

    // Auto-save current slide as completed when viewing
    useEffect(() => {
      if (currentSlide?.id && !completedSlides.has(currentSlide.id)) {
        markSlideAsCompleted(currentSlide.id)
      }
    }, [currentSlide?.id])

    // Check for lesson completion when slides change
    useEffect(() => {
      if (isLessonCompleted && !completedLessons.has(lesson.id)) {
        handleLessonCompletion()
      }
    }, [completedSlides, lesson.id])

    // Check for course completion when lessons change
    useEffect(() => {
      if (isCourseCompleted && !completedCourses.has(course.id)) {
        handleCourseCompletion()
      }
    }, [completedLessons, course.id])

  const loadUserProgress = () => {
  try {
    if (!user?.id) {
      // User not authenticated, set empty progress
      setCompletedSlides(new Set())
      setCompletedLessons(new Set())
      setCompletedCourses(new Set())
      return
    }

    const progress = {
      finalSlide: new Set<string>(),
      lessons: new Set<string>(),
      courses: new Set<string>()
    }

    // Extract from user.completeArena (primary source)
    user.completeArena?.forEach(arena => {
      switch (arena.type) {
        case "SLIDE":
          if (arena.finalSlide?.id) progress.finalSlide.add(arena.finalSlide.id)
          break
        case "LESSON":
          if (arena.lesson?.id) progress.lessons.add(arena.lesson.id)
          break
        case "COURSE":
          if (arena.course?.id) progress.courses.add(arena.course.id)
          break
      }
    })

    // Supplement with lesson-specific data (in case user.completeArena is incomplete)
    lesson.finalSlide?.forEach(slide => {
      const userCompletion = slide.completeArena?.find(
        arena => arena.userId === user.id && arena.type === "SLIDE"
      )
      if (userCompletion) {
        progress.finalSlide.add(slide.id)
      }
    })

    // Supplement with course-specific data
    course.completeArena?.forEach(arena => {
      if (arena.userId === user.id && arena.type === "LESSON" && arena.lesson?.id) {
        progress.lessons.add(arena.lesson.id)
      }
    })

    // Update state
    setCompletedSlides(progress.finalSlide)
    setCompletedLessons(progress.lessons)
    setCompletedCourses(progress.courses)

  } catch (error) {
    console.error('Failed to load user progress:', error)
    // Fallback to empty sets
    setCompletedSlides(new Set())
    setCompletedLessons(new Set())
    setCompletedCourses(new Set())
  }
}

const markSlideAsCompleted = async (slideId: string) => {
  if (completedSlides.has(slideId)) return

  setIsLoading(true)
  try {
    const response = await fetch('/api/progress/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slideId,
        lessonId: lesson.id,
        userId: user?.id
      })
    })

    if (response.ok) {
      setCompletedSlides(prev => new Set([...prev, slideId]))

    }
  } catch (error) {
    console.error('Failed to mark slide as completed:', error)
  } finally {
    setIsLoading(false)
  } 
}

const handleLessonCompletion = async () => {
  setIsLoading(true)
  try {
    const response = await fetch('/api/progress/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: lesson.id,
      })
    })

    if (response.ok) {
      setCompletedLessons(prev => new Set([...prev, lesson.id]))
      
      // Show lesson completion celebration
      setCelebrationType('lesson')
      setShowCelebration(true)
      
      // Auto-navigate to next lesson after celebration
      setTimeout(() => {
        setShowCelebration(false)
        navigateToNextLesson()
      }, 9000)
    }
  } catch (error) {
    console.error('Failed to mark lesson as completed:', error)
  } finally {
    setIsLoading(false)
  }
}

const handleCourseCompletion = async () => {
  setIsLoading(true)
  try {
    const response = await fetch('/api/progress/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: course.id,
      })
    })

    if (response.ok) {
      setCompletedCourses(prev => new Set([...prev, course.id]))
      
      // Show course completion celebration
      setCelebrationType('course')
      setShowCelebration(true)
      
      // Navigate to course completion page after celebration
      setTimeout(() => {
        setShowCelebration(false)
        navigateToCourseCompletion()
      }, 9000)
    }
  } catch (error) {
    console.error('Failed to mark course as completed:', error)
  } finally {
    setIsLoading(false)
  }
}

const navigateToNextLesson = () => {
  const currentLessonIndex = course.lessons.findIndex(l => l.id === lesson.id)
  const nextLesson = course.lessons[currentLessonIndex + 1]
  
  if (nextLesson) {
    // Navigate to next lesson
    window.location.href = `/i/lesson/${course.id}/${nextLesson.id}`
  } else {
    // This was the last lesson, course should be completed
    if (!isCourseCompleted) {
      handleCourseCompletion()
    }
  }
}

const navigateToCourseCompletion = () => {
  // Navigate to course completion page or dashboard
 // window.location.href = `/courses/${course.id}/completed`
}

  const addCourseIds = (coursesToAdd: CompleteArena[]) => {
    setCompletedCourses(prev => {
      const newSet = new Set(prev);
      coursesToAdd.forEach(arena => newSet.add(arena.course?.id));
      return newSet;
    });
  };


  const nextSlide = () => {
    if (currentSlideIndex < lesson.finalSlide.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
      setCompletedSlides((prev) => new Set([...prev, currentSlide.id]))
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index)
    setShowSlideGrid(false)
  }


  const getSlideStatus = (slideId: string) => {
    if (completedSlides.has(slideId)) return "completed"
    if (slideId === currentSlide?.id) return "current"
    return "pending"
  }


  if(isLoading){
    return <Loader2 className="animate-spin" />
  }


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="bg-gray-100  p-2 rounded-full shadow flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <Badge variant="secondary" className=" bg-green-400 text-white border-white/30">
                    <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {lesson.duration} min
                  </span>
                  </Badge>
                  
        
                  {lesson.isPaid && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="rounded-full bg-white shadow" variant="outline" size="sm" onClick={() => setShowSlideGrid(!showSlideGrid)}>
                <Grid3X3 className="w-4 h-4 mr-2" />
                Slides
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Lesson Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className=" px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Slide Grid Overlay */}
            {showSlideGrid && (
              <Card className="mb-6 border-2 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>All Slides</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowSlideGrid(false)}>
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {lesson.finalSlide.map((slide, index) => (
                      <Card
                        key={slide.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          index === currentSlideIndex ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => goToSlide(index)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-2 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-600">{index + 1}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{slide.title}</p>
                            {completedSlides.has(slide.id) && (
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Slide Viewer */}
            <Card className="shadow border-0 overflow-hidden">
              <div className="flex items-center justify-center xl:min-h-0  border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                {/* Slide Content */}
                <div className=" flex items-center justify-center text-white p-8">
                  <div className="max-w-4xl">
                    <div className="mb-20 md:mb-0 text-sm opacity-80 ">
                      Slide {currentSlideIndex + 1} of {lesson.finalSlide.length}
                      <div className="flex-shrink-0 my-2">
                              {getSlideStatus(currentSlide.id) === "completed" ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : getSlideStatus(currentSlide.id) === "current" ? (
                                <Clock className="w-5 h-5 text-blue-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
                    </div>
                    <h2 className="md:text-5xl font-bold mb-6 leading-tight">{currentSlide.title}</h2>
                    <div className="text-lg md:text-xl lg:text-justify opacity-90 space-y-4 prose prose-lg max-w-none [&_table]:table [&_table]:border-collapse [&_table]:border [&_th]:border [&_td]:border [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-2 border-gray-300">
                      {currentSlide.notes.map((note) => (
                        <div key={note.id} className="w-full">
                          <div className="overflow-x-auto">
                            <SlideContent content={note.content} type="html" />
                          </div>
                          <AIAssistant
                            title={currentSlide.title as string}
                            content={note.content}
                            userName={user?.name as string}
                          />
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
                 
              </div>

              {/* Media Controls */}
              <div className="bg-white border-t p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                    className="rounded-full shadow" 
                    variant="outline" size="sm" onClick={prevSlide} disabled={currentSlideIndex === 0}>
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <CelebrationModal show={showCelebration} type={celebrationType} onClose={() => setShowCelebration(false)} />

                    <Button
                    className="rounded-full shadow"

                    variant="outline"
                      size="sm"
                      onClick={nextSlide}
                      disabled={currentSlideIndex === lesson.finalSlide.length - 1}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Slide Navigation */}
            <Card className="mt-6 shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {lesson.finalSlide.map((slide, index) => (
                    <Button
                      key={slide.id}
                      variant={index === currentSlideIndex ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 rounded-full ${index === currentSlideIndex ? "bg-blue-600" : ""}`}
                    >
                      <span className="mr-2">{index + 1}</span>
                      {completedSlides.has(slide.id) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-1 lg:h-screen overflow-y-auto">
            {/* Current Lesson Overview */}
            <Card className=" border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Description
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-3">{lesson.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {lesson.duration} min
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.lessons.length}<Dot className="text-green-500" />{course.lessons.length === 1 || 0 ? 'Student' : 'Students' } 
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Course Progress Ring */}
            <CourseProgress 
              completionPercentage={completionPercentage}
              totalLessons={course.lessons.length}
              completedLessons={completedLessons.size}
              courseTitle={course.title}
             />

            {/* Course Lessons Timeline */}
            <Card className="shadow">
              <CardHeader>
                <CardTitle className="flex text-sm font-normal items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">

                    {/* Lesson */}

                    {course.lessons.map( lesson => (
                      <Link href={`/i/lesson/${lesson.id}/${course.id}`} key={lesson.id} className="relative">
                      <div className={cn(`flex items-start space-x-3 p-3 rounded-xl bg-green-50 shadow transition-all hover:shadow-md cursor-pointer"`,{
                        'bg-green-50' : completedLessons.has(lesson.id)
                      })}>
                       {completedLessons.has(lesson.id) &&
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        }
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-green-900 text-sm">{lesson.title}</h4>
                          <p className="text-xs text-green-700 mt-1">{lesson.duration} mins</p>
                          {completedLessons.has(lesson.id) && 
                          <div className="flex items-center mt-2 space-x-2">
                            <div className="w-full bg-green-200 rounded-full h-1.5">
                              <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                            </div>
                            <span className="text-xs text-green-600 font-medium">100%</span>
                          </div>}
                        </div>
                      </div>
                    </Link>
                    ))}
                    
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

