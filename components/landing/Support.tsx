"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Send,
  X,
  ChevronRight,
  Sparkles,
  Bot,
  User,

} from "lucide-react"

// Sample support agent data
const supportAgent = {
  name: "XTREME REGION",
  role: "Customer Support",
  avatar: "/placeholder.svg?height=80&width=80",
  isOnline: true,
}

// Sample predefined questions
const predefinedQuestions = [
  "How do I get started?",
  "What are the pricing plans?",
  "How can I upgrade my account?",
  "I need help with integration",
  "Can I request a demo?",
]

// Sample responses for demo purposes
const sampleResponses: Record<string, string> = {
  "How do I get started?":
    "Getting started is easy! Just sign up for an account and follow our interactive onboarding guide. We also have detailed documentation available at docs.example.com.",
  "What are the pricing plans?":
    "We offer three pricing tiers: Starter ($29/mo), Professional ($79/mo), and Enterprise (custom pricing). Each plan includes different features and support levels. Would you like me to explain the differences?",
  "How can I upgrade my account?":
    "You can upgrade your account anytime from your account settings page. Go to Settings > Subscription and select your desired plan. The changes will take effect immediately.",
  "I need help with integration":
    "Our platform offers various integration options through our API and native connectors. Could you tell me which service you're trying to integrate with, and I'll provide specific guidance?",
  "Can I request a demo?":
    "We'd be happy to schedule a personalized demo for you. Please provide your availability and specific areas of interest, and our team will arrange a session with one of our product specialists.",
}

// Message type definition
type Message = {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("support-chat-messages")
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(parsedMessages)
      } catch (error) {
        console.error("Error loading messages from localStorage:", error)
      }
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("support-chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  // Check URL for support parameter
  useEffect(() => {
    const supportParam = searchParams?.get("support")
    if (supportParam === "true") {
      setIsOpen(true)
    }
  }, [searchParams])

  // Add welcome message when chat is first opened (only if no existing messages)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: `Hi there! 👋 I'm ${supportAgent.name} from the support team. How can I help you today?`,
          sender: "agent",
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, messages.length])

  // Function to handle closing chat and removing query parameter
  const handleCloseChat = () => {
    setIsOpen(false)
    setHasUnreadMessages(false)

    // Remove support query parameter from URL
    const currentUrl = new URL(window.location.href)
    if (currentUrl.searchParams.has("support")) {
      currentUrl.searchParams.delete("support")
      router.replace(currentUrl.pathname + currentUrl.search, { scroll: false })
    }
  }

  // Function to clear chat history
  const clearChatHistory = () => {
    setMessages([])
    localStorage.removeItem("support-chat-messages")
    // Add welcome message back
    setMessages([
      {
        id: "welcome",
        content: `Hi there! 👋 I'm ${supportAgent.name} from the support team. How can I help you today?`,
        sender: "agent",
        timestamp: new Date(),
      },
    ])
  }

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Set unread message indicator when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasUnreadMessages(true)
    }
  }, [messages, isOpen])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate agent typing and response
    setTimeout(() => {
      const responseContent =
        sampleResponses[inputValue] ||
        "Thank you for your message. Our team will look into this and get back to you shortly. Is there anything else I can help you with?"

      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        content: responseContent,
        sender: "agent",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePredefinedQuestion = (question: string) => {
    setInputValue(question)
    setIsExpanded(false)
  }

  return (
    <>
      {/* Chat Trigger Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => {
            if (isOpen) {
              handleCloseChat()
            } else {
              setIsOpen(true)
              setHasUnreadMessages(false)
            }
          }}
          className={`
            rounded-full p-4 shadow-lg flex items-center justify-center
            bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-600 
            hover:from-cyan-300 hover:via-purple-400 hover:to-indigo-500
            transition-all duration-300 group relative overflow-hidden
            before:absolute before:inset-0 before:bg-gradient-to-r 
            before:from-transparent before:via-white/20 before:to-transparent
            before:translate-x-[-100%] hover:before:translate-x-[100%]
            before:transition-transform before:duration-700
          `}
          size="lg"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MessageSquare className="h-6 w-6 text-white mr-2" />
                <span className="text-white font-medium hidden md:inline-block">Support</span>
                {hasUnreadMessages && (
                  <motion.div
                    className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-full sm:w-[400px] md:w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            initial={{ y: 20, opacity: 0, height: "auto" }}
            animate={{ y: 0, opacity: 1, height: "auto" }}
            exit={{ y: 20, opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {/* Chat Header */}
            <div className="bg-white shadow p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-white">
                      <AvatarImage src={supportAgent.avatar || "/placeholder.svg"} alt={supportAgent.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {supportAgent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {supportAgent.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{supportAgent.name}</h3>
                    <p className="text-xs text-gray-500">{supportAgent.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={clearChatHistory}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={handleCloseChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[400px] overflow-y-auto p-4 bg-gray-100">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "agent" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                      <AvatarImage src={supportAgent.avatar || "/placeholder.svg"} alt={supportAgent.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-2 
                      ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 border border-gray-100 shadow-sm"
                      }
                    `}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-blue-500 text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center mb-4">
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                    <AvatarImage src={supportAgent.avatar || "/placeholder.svg"} alt={supportAgent.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-800">{supportAgent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-full px-4 py-2 text-gray-500 text-sm border border-gray-100">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gray-50 border-t border-gray-100 overflow-hidden"
                >
                  <div className="p-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Frequently Asked Questions</h4>
                    <div className="space-y-2">
                      {predefinedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start text-left text-sm h-auto py-2 bg-white hover:bg-gray-50"
                          onClick={() => handlePredefinedQuestion(question)}
                        >
                          <ChevronRight className="h-4 w-4 mr-2 text-blue-500" />
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="min-h-[60px] max-h-[120px] resize-none border-gray-200 focus:border-blue-300 rounded-xl"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full border-gray-200"
                  >
                    <Sparkles className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
                  >
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
