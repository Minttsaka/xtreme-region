"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid3X3,
  CheckCircle2,
  Circle,
  CheckCircle,
} from "lucide-react"
import { SlideContent } from "./dom-content"
import { AIAssistant } from "./ai-assistant"
import { Prisma } from "@prisma/client"

type Lesson = Prisma.LessonGetPayload<{
  include: {
    finalSlide: {
      include: {
        notes: true,
      }
    },
    user: true,
    resources: {
      include: {
        resource: true
      }
    }
  }
}>

export default function DemoLesson({
    lesson,
  }: { 
    lesson: Lesson
  }
) {

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [showSlideGrid, setShowSlideGrid] = useState(false)
  const [completedSlides, setCompletedSlides] = useState<Set<string>>(new Set(["slide_1"]))
  const [user, setUser] = useState<null | Record<string, any>>(null)
  
    const fetchUser = async () => {
        try {
        const res = await fetch("/api/public-user")
        const data = await res.json()
        setUser(data.user)
        } catch (err) {
        console.error("Failed to fetch user:", err)
        setUser(null)
        } 
    }
    useEffect(()=>{
        fetchUser()
    },[])

  const currentSlide = lesson.finalSlide[currentSlideIndex]
  const progress = ((currentSlideIndex + 1) / lesson.finalSlide.length) * 100

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="">
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
        <div className="gap-6">
          {/* Main Content */}
          <div>
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
                <div className=" w-full flex items-center justify-center text-white p-8">
                  <div>
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
                    <div className="text-lg md:text-xl lg:text-justify opacity-90 space-y-4 prose prose-lg [&_table]:table [&_table]:border-collapse [&_table]:border [&_th]:border [&_td]:border [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-2 border-gray-300">
                      {currentSlide.notes.map((note) => (
                        <div key={note.id}>
                          <div >
                            <SlideContent content={note.content} type="html" />
                          </div>
                          <AIAssistant
                            title={currentSlide.title as string}
                            content={note.content}
                            userName={user?.name as string ?? "Guest"}
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
        </div>
      </div>
    </div>
  )
}

