"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Resizable } from "re-resizable"
import { useDrag, useDrop, DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import type { Highlight, Slide, Comment, Reaction } from "@/types/lesson-editor"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GripVertical, Type, Plus, X, ChevronRight, MessageSquare } from "lucide-react"
import RichTextEditor from "./RichTextEditor"
import type {  User } from "@prisma/client"
import { publishMessage } from "@/lib/initAgoraClient"
import LessonChat from "../lessoncreation/LessonChat"
import { CustomButton } from "../ui/CustomButton"
import { Input } from "../ui/input"
import LessonPreview from "./LessonPreview"
import { toast } from "sonner"
import { RTMClient } from "agora-rtm-sdk"

interface NoteEditorProps {
  highlights: Highlight[]
  slides: Slide[]
  user: User
  file:boolean,
  lessonTitle:string,
  courseName:string,
  subjectName:string,
  onAddCommentToSlide: (slideId: string, comment: Comment) => void
  ondeleteComment: (slideId: string, commentId: string) => void
  onAddReactionToComment: (commentId: string, slideId: string, reaction: Reaction) => void
  onDeleteReaction: (slideId: string, commentId: string, reactionId: string) => void
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>
  onCreateNote: (highlight: Highlight) => void
  rtm: RTMClient
  channelName: string
  connectionStatus: "connected" | "disconnected" | "connecting"
  broadcastSlides: () => Promise<void>
}

interface DraggableSlideProps {
  slide: Slide
  index: number
  user: User
  rtm: RTMClient
  onAddCommentToSlide: (slideId: string, comment: Comment) => void
  ondeleteComment: (slideId: string, commentId: string) => void
  onaddreactionToComment: (commentId: string, slideId: string, reaction: Reaction) => void
  onDeleteReaction: (slideId: string, commentId: string, reactionId: string) => void
  channelName: string
  moveSlide: (fromIndex: number, toIndex: number) => void
  setSelectedSlide: React.Dispatch<React.SetStateAction<string>>
  selectedSlide: string
  onTitleEdit: (slideId: string, title: string) => void
  onNoteEdit: (slideId: string, noteId: string, content: SetStateAction<string>) => void
  onDeleteSlide: (slideId: string) => void
  onDeleteNote: (slideId: string, noteId: string) => void
}

interface UserPresenceProps {
  users: User[]
  currentUserId: string
}

const DraggableSlide: React.FC<DraggableSlideProps> = ({
  slide,
  index,
  moveSlide,
  setSelectedSlide,
  selectedSlide,
  onTitleEdit,
  onAddCommentToSlide,
  ondeleteComment,
  onaddreactionToComment,
  onDeleteReaction,
  onNoteEdit,
  onDeleteSlide,

  user,
  rtm,
  channelName,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: "slide",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "slide",
    hover(item: { index: number }) {
      if (!ref.current || item.index === index) return
      moveSlide(item.index, index)
      item.index = index
    },
  })

  drag(drop(ref))

  const handleOpenComments = () => {
    setCommentDialogOpen(true)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      ref={ref}
      className={cn(
        "relative group bg-white z-0 shadow cursor-pointer rounded-md transition-all duration-200",
        isDragging ? "opacity-50" : "opacity-100",
        selectedSlide === slide.id ? "ring-2 ring-purple-500" : "hover:ring-2 hover:ring-purple-300",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedSlide(slide.id)}
    >
      <Card className="border-none bg-white/80 backdrop-blur-sm">
        <CardContent>
          <div className="flex items-center gap-4 my-4">
            <Input
              type="text"
              value={slide.title}
              onChange={(e) => onTitleEdit(slide.id, e.target.value)}
              className="w-full text-sm border-none font-semibold bg-transparent focus:outline-none"
              placeholder="Slide Title"
              onFocus={() => setSelectedSlide(slide.id)}
              onBlur={() => setSelectedSlide("")}
            />
            {isHovered && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteSlide(slide.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Slide</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <GripVertical className="w-5 h-5 text-gray-800" />
                    </TooltipTrigger>
                    <TooltipContent className="z-50">Move Slide</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {selectedSlide === slide.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 relative"
              >
                {slide.notes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative group"
                  >
                    <RichTextEditor
                      content={note.content}
                      title={slide.title}
                      onChange={(content) => onNoteEdit(slide.id, note.id, content)}
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleOpenComments}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{slide.comments?.length || 0}</span>
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      {commentDialogOpen && selectedSlide === slide.id && (
        <LessonChat
          user={user}
          rtm={rtm}
          channelName={channelName}
          selectedSlide={slide.id}
          onAddCommentToSlide={onAddCommentToSlide}
          ondeleteComment={ondeleteComment}
          onaddreactionToComment={onaddreactionToComment}
          onDeleteReaction={onDeleteReaction}
          comments={slide.comments ?? []}
        />
      )}
    </motion.div>
  )
}

const UserPresence: React.FC<UserPresenceProps> = ({ users = [], currentUserId }) => {
  // Remove duplicate users by ID
  const uniqueUsers = users.reduce<User[]>((acc, current) => {
    const isDuplicate = acc.find((user) => user.id === current.id)
    if (!isDuplicate) {
      return [...acc, current]
    }
    return acc
  }, [])

  // Sort users to put current user first
  const sortedUsers = [...uniqueUsers].sort((a, b) => {
    if (a.id === currentUserId) return -1
    if (b.id === currentUserId) return 1
    return 0
  })

  // Get surname from full name
  const getSurname = (fullName: string) => {
    const nameParts = fullName.split(" ")
    return nameParts.length > 1 ? nameParts[nameParts.length - 1] : fullName
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {sortedUsers.map((user) => {
        const isCurrentUser = user.id === currentUserId
        const surname = getSurname(user.name as string)

        return (
          <TooltipProvider key={user.id} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative group">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                      isCurrentUser ? "border-emerald-400 ring-1 ring-emerald-400" : "border-gray-200"
                    }`}
                  >
                    {user.image ? (
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt={user.name as string}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-medium text-gray-700">{surname.charAt(0)}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white"></span>
                  <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[9px] text-gray-600 whitespace-nowrap font-medium">
                    {surname}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs py-1 px-2">
                {user.name} {isCurrentUser && "(You)"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  )
}

export default function NoteEditor({
  highlights,
  slides,
  setSlides,
  onAddCommentToSlide,
  ondeleteComment,
  onAddReactionToComment,
  onDeleteReaction,
  onCreateNote,
  rtm,
  file,
  lessonTitle,
  courseName,
  subjectName,
  channelName,
  user,
  connectionStatus,

}: NoteEditorProps) {
  const [selectedSlide, setSelectedSlide] = useState<string>("")
  const [width, setWidth] = useState(900)
  const [activeUsers, setActiveUsers] = useState<User[]>([])
  const [toastMessage, setToastMessage] = useState<string>("")

  // Set selected slide to the last one when slides change
  useEffect(() => {
    if (slides.length > 0 && !selectedSlide) {
      setSelectedSlide(slides[slides.length - 1].id)
    }
  }, [slides.length])

  // Handle user joining
  useEffect(() => {
    if (!user || !rtm || !channelName) return

    const joinChannel = async () => {
      try {
        await publishMessage(rtm, channelName, {
          type: "user_join",
          userId: user.id,
          user,
          message: `${user.name} joined.`,
        })
      } catch (error) {
        console.error("Error joining channel:", error)
      }
    }

    joinChannel()
  }, [user, rtm, channelName])

  // Handle toast messages
  useEffect(() => {
    if (toastMessage !== "") {
      toast(toastMessage)
      setToastMessage("")
    }
  }, [toastMessage,])

  // RTM event handlers
  useEffect(() => {
    if (!rtm || !user) return

    const handleMessage = (event: any) => {
      try {
        const message = JSON.parse(event.message)

        if (message.type === "slides_move") {
          setToastMessage(message.message)
        } else if (message.type === "text") {
          const newComment: Comment = {
            id: message.id,
            text: message.text,
            sender: {
              id: message.sender.id,
              name: message.sender.name,
              image: message.sender.image,
              email: message.sender.email,
            },
            reactions: [],
            createdAt: new Date(message.timestamp),
            updatedAt: new Date(message.timestamp),
          }
          onAddCommentToSlide(message.slide, newComment)
        } else if (message.type === "reaction") {
          const newReaction: Reaction = {
            id: message.id,
            emoji: message.emoji,
            user: message.sender,
          }

          if (message.action === "add") {
            onAddReactionToComment(message.messageId, message.slide, newReaction)
          } else if (message.action === "remove") {
            onDeleteReaction(message.slide, message.messageId, message.reactionId)
          }
        } else if (message.type === "slide_deleted") {
          setToastMessage(message.message)
        } else if (message.type === "user_join") {
          setToastMessage(message.message)
          setActiveUsers((prev) => {
            // Prevent duplicate users
            const exists = prev.find((u) => u.id === message.user.id)
            if (!exists) {
              return [...prev, message.user]
            }
            return prev
          })
        } else if (message.type === "slide_selected" && message.userId !== user.id) {
          setSelectedSlide(message.slideId)
        }
      } catch (err) {
        console.error("Error processing message:", err)
      }
    }

    const handlePresence = (event: any) => {
      switch (event.eventType) {
        case "JOIN":
          
          break
        case "LEAVE":
        
          // Remove user from active users
          setActiveUsers((prev) => prev.filter((u) => u.id !== event.publisher))
          break
        case "SNAPSHOT":
       
          break
        default:
     
      }
    }

    const handleStatus = () => {

    }

    rtm.addEventListener("message", handleMessage)
    rtm.addEventListener("presence", handlePresence)
    rtm.addEventListener("status", handleStatus)

    return () => {
      if (rtm) {
        rtm.removeEventListener("message", handleMessage)
        rtm.removeEventListener("presence", handlePresence)
        rtm.removeEventListener("status", handleStatus)
      }
    }
  }, [rtm, user, onAddCommentToSlide, onAddReactionToComment, onDeleteReaction])

  const moveSlide = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const newSlides = Array.from(slides)
      const [movedSlide] = newSlides.splice(fromIndex, 1)
      newSlides.splice(toIndex, 0, movedSlide)
      setSlides(newSlides)

      if (rtm && channelName && user) {
        try {
          await publishMessage(rtm, channelName, {
            type: "slides_move",
            userId: user.id,
            slides: newSlides,
            message: `${user.name} moved slide ${movedSlide.title}`,
          })
        } catch (error) {
          console.error("Error broadcasting slide move:", error)
        }
      }
    },
    [slides, setSlides, rtm, channelName, user],
  )

  const onDeleteSlide = useCallback(
    async (slideId: string) => {
      const slideToDelete = slides.find((slide) => slide.id === slideId)

      if (rtm && channelName && user && slideToDelete) {
        try {
          await publishMessage(rtm, channelName, {
            type: "slide_deleted",
            userId: user.id,
            slides: slides.filter((s) => s.id !== slideId),
            message: `${user.name} deleted slide ${slideToDelete.title}`,
          })
        } catch (error) {
          console.error("Error broadcasting slide deletion:", error)
        }
      }

      setSlides((prevSlides) => prevSlides.filter((slide) => slide.id !== slideId))

      if (selectedSlide === slideId) {
        setSelectedSlide("")
      }
    },
    [slides, setSlides, selectedSlide, rtm, channelName, user],
  )

  const onDeleteNote = useCallback(
    (slideId: string, noteId: string) => {
      setSlides((prevSlides) =>
        prevSlides.map((slide) =>
          slide.id === slideId ? { ...slide, notes: slide.notes.filter((note) => note.id !== noteId) } : slide,
        ),
      )
    },
    [setSlides],
  )

  const onNoteEdit = useCallback(
  (slideId: string, noteId: string, content: SetStateAction<string>) => {
    setSlides((prevSlides) =>
      prevSlides.map((s) =>
        s.id === slideId
          ? {
              ...s,
              notes: s.notes.map((note) =>
                note.id === noteId
                  ? {
                      ...note,
                      content:
                        typeof content === "function"
                          ? content(note.content) // Evaluate the function
                          : content, // Or just assign the string
                    }
                  : note
              ),
            }
          : s
      )
    );
  },
  [setSlides]
);

  // const onNoteEdit = useCallback(
  //   (slideId: string, noteId: string, content: string) => {
  //     setSlides((prevSlides) =>
  //       prevSlides.map((s) =>
  //         s.id === slideId
  //           ? {
  //               ...s,
  //               notes: s.notes.map((note) => (note.id === noteId ? { ...note, content } : note)),
  //             }
  //           : s,
  //       ),
  //     )
  //   },
  //   [setSlides],
  // )

  const onTitleEdit = useCallback(
    (slideId: string, title: string) => {
      setSlides((prevSlides) => prevSlides.map((s) => (s.id === slideId ? { ...s, title } : s)))
    },
    [setSlides],
  )

  const createInitialHighlight = useCallback(
    (highlight: Highlight) => {
      const newNote = {
        id: Date.now().toString(),
        content: highlight.content,
        type: "text" as const,
      }
      const newSlide = {
        id: Date.now().toString(),
        title: highlight.content,
        notes: [newNote],
        comments: [],
      }

      setSlides((prevSlides) => [...prevSlides, newSlide])
      setSelectedSlide(newSlide.id)
      //onCreateNote(highlight)

      toast("Your highlight has been converted into a slide.")
      
      if (rtm && channelName && user) {
        try {
          publishMessage(rtm, channelName, {
            type: "slide_created",
            userId: user.id,
            slide: newSlide,
            message: `${user.name} created a slide from a highlight`,
          })
        } catch (error) {
          console.error("Error broadcasting slide creation:", error)
        }
      }
    },
    [setSlides, onCreateNote, toast, rtm, channelName, user],
  )

  return (
    <div className="flex h-full overflow-hidden">
      <DndProvider backend={HTML5Backend}>
        {/* Left Panel - Slides */}
        <div className="hidden lg:block">
          <Resizable
            size={{ width }}
            onResizeStop={(e, direction, ref, d) => {
              setWidth(Math.max(320, Math.min(800, width + d.width)))
            }}
            minWidth={320}
            maxWidth={800}
            enable={{ right: true }}
            className="relative bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full"
          >
            <div className="flex flex-col h-full">
              {/* Collaboration status */}
              <div className="flex-shrink-0 p-2 border-b border-gray-200 dark:border-gray-700">
                {user && connectionStatus === "connected" && (
                  <UserPresence users={activeUsers} currentUserId={user.id} />
                )}
              </div>

              {/* Slides section */}
              <div className="flex-1 min-h-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">Slides ({slides.length})</h2>
                </div>

                <ScrollArea className="h-48 md:h-[calc(100vh-12rem)]">
                  <div className="p-4 pb-96 space-y-4">
                    <AnimatePresence>
                      {slides.map((slide, index) => (
                        <DraggableSlide
                          key={slide.id}
                          slide={slide}
                          user={user}
                          onAddCommentToSlide={onAddCommentToSlide}
                          ondeleteComment={ondeleteComment}
                          onaddreactionToComment={onAddReactionToComment}
                          onDeleteReaction={onDeleteReaction}
                          rtm={rtm}
                          onTitleEdit={onTitleEdit}
                          channelName={channelName}
                          index={index}
                          moveSlide={moveSlide}
                          setSelectedSlide={setSelectedSlide}
                          selectedSlide={selectedSlide}
                          onNoteEdit={onNoteEdit}
                          onDeleteSlide={onDeleteSlide}
                          onDeleteNote={onDeleteNote}
                        />
                      ))}
                    </AnimatePresence>

                    <CustomButton
                      className="w-full flex gap-2 items-center justify-center"
                      onClick={() =>
                        createInitialHighlight({
                          id: Date.now(),
                          highlightAreas: [],
                          quote: "Untitled",
                          color: "Red",
                          content: "New Slide",
                        })
                      }
                    >
                      <span>Add Custom Slide</span>
                    </CustomButton>
                  </div>
                  <ScrollBar />
                </ScrollArea>
              </div>
            </div>
          </Resizable>
        </div>

        {/* Mobile Slides Panel - Collapsible */}
        <div className="lg:hidden w-full border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Slides ({slides.length})</h2>
            <ScrollArea className="h-32">
              <div className="flex gap-2 pb-2">
                {slides.map((slide, index) => (
                  <Card
                    key={slide.id}
                    className={cn(
                      "flex-shrink-0 w-24 h-16 cursor-pointer transition-all",
                      selectedSlide === slide.id ? "ring-2 ring-purple-500" : "",
                    )}
                    onClick={() => setSelectedSlide(slide.id)}
                  >
                    <CardContent className="p-2 h-full flex items-center justify-center">
                      <span className="text-xs font-medium">{index + 1}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {file ? (
            <div className="flex flex-col h-full">
              <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Type className="w-5 h-5 text-purple-500" />
                  Highlights
                </h2>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {highlights.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>No highlights yet. Highlight text in the PDF to create notes.</p>
                    </div>
                  ) : (
                    highlights.map((highlight) => (
                      <motion.div
                        key={highlight.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group relative"
                      >
                        <Card className="border-none bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{highlight.content}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onCreateNote(highlight)}
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Note
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <LessonPreview
              slides={slides}
              lessonTitle={lessonTitle}
              courseName={courseName}
              subjectName={subjectName}
            />
          )}
        </div>
      </DndProvider>
    </div>

  )
}
