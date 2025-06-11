"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import type { Comment, Highlight, Reaction, Slide } from "@/types/lesson-editor"
import { LessonNavbar } from "@/components/lessoncreation/LessonNavbar"
import type { Prisma, User } from "@prisma/client"
import { initializeAgoraRTM } from "@/lib/initAgoraClient"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

type Lesson = Prisma.LessonGetPayload<{
  include: {
    slides: {
      include: {
        theme: true
        notes: {
          include: {
            highlight: true
          }
        }
      }
    }
    course: {
      include: {
        subjectToClass: {
          include: {
            subject: true
          }
        }
      }
    }
    resources: {
      include: {
        resource: {
          include: {
            authors: true
          }
        }
      }
    }
  }
}>

const PDFViewer = dynamic(() => import("./PdfViewer"), { ssr: false })
const NoteEditor = dynamic(() => import("./NoteEditor"), { ssr: false })

export default function CourseEditor({ lesson, user }: { 
  lesson: Lesson, 
  user: User 
}) {
  const [pdfFile, setPdfFile] = useState<string | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [slides, setSlides] = useState<Slide[]>([])
  const [rtm, setRtm] = useState<any>(null)
  const [channelName, setChannelName] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")

  // Refs to track state and prevent unnecessary saves
  const slidesRef = useRef<Slide[]>([])
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialLoadRef = useRef(true)
  const lastSavedSlidesRef = useRef<string>("")

  useEffect(() => {
    setupRTM()
    setPdfFile(lesson.resources[0]?.resource.fileUrl)
    loadInitialSlides()
  }, [])

  // Debounced autosave effect
  useEffect(() => {
    // Skip saving during initial load or if slides haven't actually changed
    if (isInitialLoadRef.current || slides.length === 0) {
      slidesRef.current = slides
      return
    }

    // Check if slides actually changed by comparing stringified versions
    const currentSlidesString = JSON.stringify(slides)
    if (currentSlidesString === lastSavedSlidesRef.current) {
      return
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      handleSaveSlides(slides)
    }, 1000) // 1 second debounce

    // Update refs
    slidesRef.current = slides

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [slides])

  const setupRTM = async () => {
    try {
      const channelId = `lesson-${lesson.id}`
      setConnectionStatus("connecting")
      const { rtm, channelName } = await initializeAgoraRTM(channelId, user)
      setChannelName(channelName)
      if (rtm) {
        setConnectionStatus("connected")
      }
      setRtm(rtm)
    } catch (error) {
      console.error("Failed to initialize Agora RTM:", error)
      setConnectionStatus("disconnected")
    }
  }

  const loadInitialSlides = async () => {
    try {
      const res = await fetch(`/api/save-slides/${lesson.id}`)
      if (!res.ok) {
        throw new Error("Failed to fetch slides")
      }
      const data = await res.json()

      // Ensure we have valid slide data
      const validSlides = Array.isArray(data) ? data : []
      setSlides(validSlides)
      lastSavedSlidesRef.current = JSON.stringify(validSlides)

      // Mark initial load as complete
      setTimeout(() => {
        isInitialLoadRef.current = false
      }, 100)
    } catch (error) {
      console.error("Error fetching slides:", error)
      toast("Failed to load slides")
      isInitialLoadRef.current = false
    }
  }

  const handlePublishSlides = useCallback(
    async (slidesToSave: Slide[]) => {
      // Prevent multiple simultaneous saves
      if (isSaving || slidesToSave.length === 0) {
        return
      }

      try {
        setIsSaving(true)

        // Validate and clean slide data
        const validSlides = slidesToSave.map((slide) => ({
          id: slide.id,
          title: slide.title || "Untitled Slide",
          lessonId: lesson.id,
          comments: (slide.comments || []).map((comment) => ({
            content: comment.text || "",
            reactions: comment.reactions || [],
            slideId: slide.id,
            sender: comment.sender,
          })),
          notes: (slide.notes || []).map((note) => ({
            content: note.content || "",
            source: note.source,
            type: note.type || "text",
          })),
        }))

        const response = await fetch(`/api/save-slides/${lesson.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId: lesson.id,
            slides: validSlides,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to save slides: ${response.statusText}`)
        }

        // Update last saved reference only on successful save
        lastSavedSlidesRef.current = JSON.stringify(slidesToSave)
        setLastSaved(new Date())
      } catch (error) {
        console.error("Error saving slides:", error)
        toast("Failed to load save")
      } finally {
        setIsSaving(false)
      }
    },
    [lesson.id, isSaving],
  )

  const handleSaveSlides = useCallback(
    async (slidesToSave: Slide[]) => {
      // Prevent multiple simultaneous saves
      if (isSaving || slidesToSave.length === 0) {
        return
      }

      try {
        setIsSaving(true)

        // Validate and clean slide data
        const validSlides = slidesToSave.map((slide) => ({
          id: slide.id,
          title: slide.title || "Untitled Slide",
          lessonId: lesson.id,
          comments: (slide.comments || []).map((comment) => ({
            content: comment.text || "",
            reactions: comment.reactions || [],
            slideId: slide.id,
            sender: comment.sender,
          })),
          notes: (slide.notes || []).map((note) => ({
            content: note.content || "",
            source: note.source,
            type: note.type || "text",
          })),
        }))

        const response = await fetch("/api/save-slides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId: lesson.id,
            slides: validSlides,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to save slides: ${response.statusText}`)
        }

        // Update last saved reference only on successful save
        lastSavedSlidesRef.current = JSON.stringify(slidesToSave)
        setLastSaved(new Date())
      } catch (error) {
        console.error("Error saving slides:", error)
        toast("Failed to load save. Save manually")
      } finally {
        setIsSaving(false)
      }
    },
    [lesson.id, isSaving],
  )

  const handleHighlight = (newHighlight: Highlight) => {
    setHighlights([...highlights, newHighlight])
  }

  const handleAddCommenToSlide = (slideId: string, comment: Comment) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide) => {
        if (slide.id === slideId) {
          return {
            ...slide,
            comments: [...(slide.comments || []), comment],
          }
        }
        return slide
      }),
    )
  }

  const handleDeleteComment = (slideId: string, commentId: string) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide) => {
        if (slide.id === slideId) {
          const updatedComments = (slide.comments || []).filter((comment) => comment.id !== commentId)
          return {
            ...slide,
            comments: updatedComments,
          }
        }
        return slide
      }),
    )
  }

  const handleAddReactionToComment = (slideId: string, commentId: string, reaction: Reaction) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide) => {
        if (slide.id === slideId) {
          const updatedComments = (slide.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const updatedReactions = [...(comment.reactions || []), reaction]
              return {
                ...comment,
                reactions: updatedReactions,
              }
            }
            return comment
          })
          return {
            ...slide,
            comments: updatedComments,
          }
        }
        return slide
      }),
    )
  }

  const handleDeleteReactionFromComment = (slideId: string, commentId: string, reactionId: string) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide) => {
        if (slide.id === slideId) {
          const updatedComments = (slide.comments || []).map((comment) => {
            if (comment.id === commentId) {
              const updatedReactions = (comment.reactions || []).filter((r) => r.id !== reactionId)
              return {
                ...comment,
                reactions: updatedReactions,
              }
            }
            return comment
          })
          return {
            ...slide,
            comments: updatedComments,
          }
        }
        return slide
      }),
    )
  }

  const handleCreateNote = (highlight: Highlight) => {
    const newNote = {
      id: Date.now().toString(),
      content: highlight.quote,
      type: "text" as const,
    }
    const newSlide = {
      id: Date.now().toString(),
      title: highlight.content,
      notes: [newNote],
      comments: [],
    }
    setSlides((prevSlides) => [...prevSlides, newSlide])
  }

  const broadcastSlides = useCallback(async () => {
    await loadInitialSlides()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Navbar */}
      <div className="flex-shrink-0">
        <LessonNavbar
          handlePublishSlides={handlePublishSlides}
          resources={lesson.resources}
          setPdfFile={setPdfFile}
          courseName={lesson.course.title}
          subjectName={lesson.course.subjectToClass.subject?.name}
          lessonName={lesson.title}
          isSaving={isSaving}
          lastSaved={lastSaved}
          slides={slides}
          user={user}
          onSaveSlides={handleSaveSlides}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 dark:bg-gray-900">
        {/* PDF Viewer - Hidden on mobile when no file */}
        {pdfFile && (
          <div
            className={cn(
              "w-full lg:w-1/2 flex-shrink-0",
              "h-64 lg:h-full", // Fixed height on mobile, full height on desktop
              "border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700",
            )}
          >
            <Tabs defaultValue="read">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="read">Read View</TabsTrigger>
                <TabsTrigger value="editor">Editor View</TabsTrigger>
              </TabsList>
      
              <TabsContent value="read" className="h-full p-2 lg:p-4 overflow-auto">
                <div className="h-full w-full">
                    <iframe
                      src={`${pdfFile}#toolbar=0&navpanes=0`}
                      className="w-full h-full border-0"
                      title={pdfFile}
                    />
                  </div>
              </TabsContent>
      
              <TabsContent value="editor" className="h-full p-2 lg:p-4 overflow-auto">
                  <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <PDFViewer file={pdfFile} onHighlight={handleHighlight} highlights={highlights} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Note Editor - Takes remaining space */}
        <div className={cn("flex-1 min-h-0", pdfFile ? "w-full lg:w-1/2" : "w-full")}>
          <NoteEditor
            highlights={highlights}
            slides={slides}
            setSlides={setSlides}
            onCreateNote={handleCreateNote}
            user={user}
            onAddCommentToSlide={handleAddCommenToSlide}
            ondeleteComment={handleDeleteComment}
            onAddReactionToComment={handleAddReactionToComment}
            onDeleteReaction={handleDeleteReactionFromComment}
            rtm={rtm}
            file={!!pdfFile}
            lessonTitle={lesson.title}
            courseName={lesson.course.title}
            subjectName={lesson.course.subjectToClass.subject?.name as string}
            channelName={channelName}
            connectionStatus={connectionStatus}
            broadcastSlides={broadcastSlides}
          />
        </div>
      </div>
    </div>
  )
}
