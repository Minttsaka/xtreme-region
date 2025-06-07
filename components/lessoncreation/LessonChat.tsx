"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Send, Smile,  } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AnimatePresence, motion } from "framer-motion"
import { VoiceRecorder } from "./VoiceRecorder"
import { publishMessage } from "@/lib/initAgoraClient"
import type { Comment, Reaction, User } from "@/types/lesson-editor"
import { RTMClient } from "agora-rtm-sdk"

// This is a placeholder for the emoji picker - you'll need to install a real one
// For example: npm install emoji-mart
interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void
}

// Placeholder for emoji picker - replace with actual implementation
function Picker({ onEmojiSelect }: EmojiPickerProps) {
  const commonEmojis = ["😊", "👍", "❤️", "🎉", "🔥", "😂", "👏", "🙏"]

  return (
    <div className="p-2 grid grid-cols-4 gap-2">
      {commonEmojis.map((emoji) => (
        <button
          key={emoji}
          className="text-2xl p-2 hover:bg-white/10 rounded"
          onClick={() => onEmojiSelect({ native: emoji })}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}

interface ChatInterfaceProps {
  user: User
  rtm: RTMClient
  channelName: string
  comments:Comment[]
  onAddCommentToSlide: (slideId: string, comment: Comment) => void
  ondeleteComment: (slideId: string, commentId: string) => void
  onaddreactionToComment: (commentId: string, slideId: string, reaction: Reaction) => void
  onDeleteReaction: (slideId: string, commentId: string, reactionId: string) => void
  selectedSlide:string
}

export default function LessonChat({ 
  user, 
  rtm,
  channelName ,
  comments,
  selectedSlide
}
  : ChatInterfaceProps) {

  const [newMessage, setNewMessage] = useState("")
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)
  const commentsEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const [isAITyping, setIsAITyping] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    // Add a small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)

    return () => clearTimeout(timer)
  }, [comments])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    if (!rtm) return
  
    try {
  
      const comment: Comment = {
        id: Date.now().toString(),
        text: newMessage,
        sender: {
          id: user.id as string,
          name: user.name as string,
          image: user.image as string,
          email: user.email as string,
        },
        reactions: [],
        type: "text",
        slide: selectedSlide,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  
      await publishMessage(rtm, channelName, comment)
  
      setNewMessage('')
      if (inputRef.current) inputRef.current.textContent = ''
    } catch (error) {
      console.error('Failed to send comment:', error)
    }
  }


  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex-1 flex flex-col p-4 text-white">
      <AnimatePresence>
        {isAITyping && (
          <motion.div
            className="mt-1 flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="text-xs text-purple-300">Recording...</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        ref={scrollRef as any}
        className="flex-1 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
          {comments.length === 0 ? (
            <div className="h-full flex text-center text-xs items-center justify-center text-indigo-300">
              No comments yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${message.sender.id === user.id ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex gap-2 group">
                    {message.sender.id !== user.id && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={message.sender.image} />
                        <AvatarFallback className="bg-gray-100 text-xs shadow-lg">
                          {getInitials(message?.sender?.name as string)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="flex flex-col">
                      {/* Sender name above message for current user */}
                      {message.sender.id === user.id && (
                        <div className="text-right font-medium text-xs mb-1 text-indigo-300/80 pr-1">
                          {message.sender.name}
                        </div>
                      )}

                      <div
                        className={`p-3.5 relative ${
                          message.sender.id === user.id
                            ? "bg-blue-300 text-white shadow-lg shadow-indigo-900/20"
                            : "bg-gray-100 text-white shadow-lg shadow-black/20"
                        }`}
                        
                      >
                        {/* Glowing border effect */}
                        <div
                          className="absolute inset-0 -z-10 opacity-50 blur-sm"
                          style={{
                            background: message.sender.id === user.id
                              ? "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))"
                              : "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(99, 102, 241, 0.2))",
                            borderRadius: message.sender.id === user.id ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
                          }}
                        ></div>

                        {/* Sender name inside message for non-current user */}
                        {message.sender.id !== user.id && (
                          <div className="font-semibold text-sm mb-1.5 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                            {message.sender.name}
                          </div>
                        )}

                        <p className="leading-relaxed text-xs break-words whitespace-pre-wrap max-w-[300px]">
                          {message.text}
                        </p>

                        {/* <div
                          className={`text-xs mt-1.5 ${message.sender.id === user.id ? "text-gray-100" : "text-gray-200"}`}
                        >
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </div> */}

                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="absolute -bottom-2 left-0 flex gap-1 "
                        >
                          {message.reactions.length > 0 && (
                            <div
                              className="px-2.5 py-1 rounded-full text-xs z-50 flex items-center gap-1 shadow-lg"
                              style={{
                                background: "linear-gradient(135deg, rgba(79, 70, 229, 0.7), rgba(124, 58, 237, 0.7))",
                                backdropFilter: "blur(4px)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                              }}
                            >
                              {message.reactions.map((reaction, index) => (
                                <span key={index} className="text-sm">
                                  {reaction.emoji}
                                </span>
                              ))}
                              <span className="text-xs text-white/70"> {message.reactions.length} </span>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>

                    {message.sender.id === user.id && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-xs shadow-lg">
                          {getInitials(message.sender.name as string)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={commentsEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <form onSubmit={sendMessage} className="flex flex-col gap-4">
          <div className="relative">
            {/* Input field with dimensional effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-md"></div>
            <textarea
              className="relative min-h-[80px] max-h-[80px]  focus:outline-  w-full rounded-xl bg-gray-900/50 backdrop-blur-md px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 overflow-y-auto border border-white/10 resize-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(e)
                }
              }}
            />

            {/* Input actions */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-white/10 bg-black/30 backdrop-blur-sm border border-white/10"
                  >
                    <Smile className="h-4 w-4 text-indigo-300" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-white/10 bg-black/80 backdrop-blur-xl"
                  side="top"
                  align="end"
                >
                  <Picker
                    onEmojiSelect={(emoji: any) => {
                      setNewMessage((prev) => prev + emoji.native)
                      setIsEmojiOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>

              {/* <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-white/10 bg-black/30 backdrop-blur-sm border border-white/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 text-indigo-300" />
              </Button> */}
            </div>
          </div>

          {/* Send button with dimensional effect */}
          <div className="flex items-center justify-between">
            <VoiceRecorder inputRef={inputRef} setIsAITyping={setIsAITyping} setNewMessage={setNewMessage} />
            <p className="text-xs bg-black p-3 test-white rounded-md shadow">XTREME-REGION</p>

            <Button
              type="submit"
              className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border border-white/10 shadow-lg shadow-indigo-500/20"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
