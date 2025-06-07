"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Eye, FileText, } from "lucide-react"
import type { Slide } from "@/types/lesson-editor"
import { SlideContent } from "./dom-content"
import { cn } from "@/lib/utils"

interface LessonPreviewProps {
  slides: Slide[]
  lessonTitle: string
  courseName: string
  subjectName?: string
}

export default function LessonPreview({ slides, lessonTitle, courseName, subjectName }: LessonPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0)


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (slides.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Yet</h3>
            <p className="text-gray-500 text-sm">
              Create slides from highlights or add custom slides to see the preview.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Lesson Preview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {courseName} {subjectName && `• ${subjectName}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Slide Navigation Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col">
          <div className="flex-shrink-0 p-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Slides</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {slides.length > 0 ? `${currentSlide + 1} of ${slides.length}` : "No slides"}
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-2">
              {slides.map((slide, index) => (
                <motion.div key={slide.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      index === currentSlide
                        ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800",
                    )}
                    onClick={() => goToSlide(index)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium",
                            index === currentSlide
                              ? "bg-purple-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
                          )}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                            {slide.title || `Slide ${index + 1}`}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {slide.notes && slide.notes.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {slide.notes.length} notes
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Navigation */}
          <div className="lg:hidden flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {slides.length > 0 ? `${currentSlide + 1} of ${slides.length}` : "No slides"}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  disabled={slides.length <= 1 || currentSlide === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  disabled={slides.length <= 1 || currentSlide === slides.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Slide Header - Desktop */}
          <div className="hidden lg:block flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {currentSlideData.title || `Slide ${currentSlide + 1}`}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lessonTitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  disabled={slides.length <= 1 || currentSlide === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  disabled={slides.length <= 1 || currentSlide === slides.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Slide Content Area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Card className="h-full rounded-none border-0 shadow-none overflow-hidden">
              <div className="h-full bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-auto relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                {/* Slide Content */}
                <div className="relative z-10 h-full flex items-center justify-center p-4 lg:p-8">
                  <div className="w-full max-w-4xl text-center">
                    <div className="text-sm opacity-80 mb-4 lg:mb-8">
                      {slides.length > 0 ? `${currentSlide + 1} / ${slides.length}` : "0 / 0"}
                    </div>
                    <h2 className="text-2xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight">
                      {currentSlideData.title || "No Title"}
                    </h2>
                    <div className="text-base lg:text-xl opacity-90 space-y-4 text-left table-auto  [&_th]:border [&_td]:border [&_td]:p-2 [&_th]:p-2">
                      {currentSlideData.notes?.map((note: any) => (
                        <SlideContent content={note.content} type="html" key={note.id} />
                      )) || <p>No content available</p>}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Footer Controls */}
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">XTREME-REGION</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
