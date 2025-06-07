"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, X, Send, Loader2, ChevronRight, Copy, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AIChatToggleProps {
  editor: any,
  title: string,
  content:string,
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AIChatToggle({
  editor,
  title,
  content
}: AIChatToggleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const prompt = `
        You are an AI tutor helping a student understand a lesson slide.

        Slide Title: ${title}
        Slide Content: ${content}

        The student asked: "${userMessage.content}"

        Your task:
        - Respond in a clear, friendly tone.
        - Reference the slide content as needed.
        - You may explain, summarize, or ask thoughtful follow-up questions to help the student learn.

        Reply only with the assistant's message. no html format, just plain text.
        `;

      const res = await fetch("/api/ai-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()

      const aiResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data // Assuming your API returns the message as `response`
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
  
  }

  const insertToEditor = (content: string) => {
    if (!editor) return

    // Insert at current cursor position
    editor.commands.insertContent(content)

    // Flash notification
    const notification = document.createElement("div")
    notification.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5"
    notification.textContent = "Content added to editor!"
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("animate-out", "fade-out", "slide-out-to-bottom-5")
      setTimeout(() => notification.remove(), 300)
    }, 2000)
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={handleToggle}
        className={cn(
          "fixed bottom-6 z-50 right-6 rounded-full p-3 shadow-lg",
          "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600",
          "transition-all duration-300 ease-in-out",
          isOpen ? "rotate-90 scale-110" : "scale-100",
        )}
        size="icon"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        <span className="sr-only">Toggle AI Assistant</span>
      </Button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-0 top-0 right-0 w-[90vw] sm:w-[400px] max-w-md z-50",
              "bg-white dark:bg-gray-900 rounded-e-md shadow-2xl border border-gray-200 dark:border-gray-800",
              "flex flex-col overflow-hidden z-50",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-600/10 to-blue-500/10">
                 <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ask for examples, ideas, or help</p>
                </div>
              <Button variant="ghost" size="icon" onClick={handleToggle}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 items-center justify-center mb-4">
                      <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">How can I help you?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Ask for lesson examples, code snippets, or teaching ideas
                    </p>
                    <div className="flex flex-col gap-2">
                      {["Generate a lesson introduction", "Create a code example", "Make a task list"].map(
                        (example) => (
                          <Button
                            key={example}
                            variant="outline"
                            className="text-left justify-start"
                            onClick={() => {
                              setInput(example)
                              inputRef.current?.focus()
                            }}
                          >
                            <ChevronRight className="mr-2 h-4 w-4" />
                            {example}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2",
                          message.role === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                        )}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>

                        {message.role === "assistant" && (
                          <div className="flex gap-1 mt-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => insertToEditor(message.content)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Insert All
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => {
                                navigator.clipboard.writeText(message.content)
                                // Show toast or notification
                              }}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600 dark:text-purple-400" />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="max-h-[10px] pr-12 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="absolute bottom-2 right-2 h-8 w-8"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
