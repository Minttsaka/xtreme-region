"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Link,
  Copy,
  Check,
  X,
  Twitter,
  Facebook,
  Linkedin,
  MessageSquare,
  Github,
  Slack,
  Send,
  Plus,
  Users,
} from "lucide-react"

interface InvitationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName?: string
}

export default function InvitationModal({ open, onOpenChange, projectName = "Project Nebula" }: InvitationModalProps) {
  const [activeTab, setActiveTab] = useState("email")
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [message, setMessage] = useState(`Hey, I'd like to collaborate with you on ${projectName}!`)
  const [permission, setPermission] = useState("view")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const inviteLink = "https://app.example.com/invite/xyz123"

  const handleAddEmail = () => {
    if (currentEmail && !emails.includes(currentEmail) && currentEmail.includes("@")) {
      setEmails([...emails, currentEmail])
      setCurrentEmail("")
    }
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendInvites = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onOpenChange(false)
    }, 1500)
  }

  const socialPlatforms = [
    { name: "Twitter", icon: Twitter, color: "bg-[#1DA1F2]" },
    { name: "LinkedIn", icon: Linkedin, color: "bg-[#0A66C2]" },
    { name: "Facebook", icon: Facebook, color: "bg-[#1877F2]" },
    { name: "Slack", icon: Slack, color: "bg-[#4A154B]" },
    { name: "GitHub", icon: Github, color: "bg-[#24292e]" },
    { name: "Discord", icon: MessageSquare, color: "bg-[#5865F2]" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Invite Collaborators
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Invite team members to collaborate on {projectName}
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-cyan-500/20 rounded-full blur-xl" />

          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="relative z-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-lg rounded-full"></div>
              <div className="relative z-10 flex justify-center">
                <div className="bg-slate-800/80 backdrop-blur-sm p-1 rounded-full border border-slate-700 flex items-center">
                  {[
                    { id: "email", icon: Mail, label: "Email" },
                    { id: "link", icon: Link, label: "Link" },
                    { id: "social", icon: Users, label: "Social" },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id
                    const Icon = tab.icon

                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                          isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTabBackground"
                            className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 backdrop-blur-sm bg-slate-800/50 rounded-lg border border-slate-700 p-4">
              <TabsContent value="email" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Input
                      placeholder="Enter email address"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                    <motion.button
                      onClick={handleAddEmail}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="ml-2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-700/20"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {emails.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2 mt-2"
                      >
                        {emails.map((email) => (
                          <motion.div
                            key={email}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Badge className="pl-2 pr-1 py-1 bg-slate-700 hover:bg-slate-700 text-white flex items-center gap-1">
                              {email}
                              <button
                                onClick={() => handleRemoveEmail(email)}
                                className="ml-1 rounded-full hover:bg-slate-600 p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Permission level</label>
                  <Select value={permission} onValueChange={setPermission}>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="view">Can view</SelectItem>
                      <SelectItem value="comment">Can comment</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Add a message (optional)</label>
                  <Textarea
                    placeholder="Write a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white resize-none"
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="link" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Share this link to invite people</label>
                  <div className="flex items-center">
                    <Input value={inviteLink} readOnly className="bg-slate-900 border-slate-700 text-white" />
                    <motion.button
                      onClick={copyToClipboard}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="ml-2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-700/20"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Permission level for link</label>
                  <Select value={permission} onValueChange={setPermission}>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="view">Can view</SelectItem>
                      <SelectItem value="comment">Can comment</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Link expiration</label>
                  <Select defaultValue="never">
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="1day">1 day</SelectItem>
                      <SelectItem value="7days">7 days</SelectItem>
                      <SelectItem value="30days">30 days</SelectItem>
                      <SelectItem value="never">Never expires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Share via social platforms</label>
                  <div className="grid grid-cols-3 gap-3">
                    {socialPlatforms.map((platform) => (
                      <motion.button
                        key={platform.name}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                        <div
                          className={`relative ${platform.color} rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all`}
                        >
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAgMCBMIDAgMCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
                          <platform.icon className="h-5 w-5 text-white" />
                          <span className="text-xs text-white font-medium">{platform.name}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Custom message</label>
                  <Textarea
                    placeholder="Write a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white resize-none"
                    rows={3}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="mt-6 flex gap-3">
          <motion.button
            onClick={() => onOpenChange(false)}
            className="group relative px-4 py-2 overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 border border-slate-700 rounded-md opacity-100 group-hover:opacity-0 transition-opacity" />
            <div className="absolute inset-0 bg-slate-800 border border-slate-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 text-slate-300 group-hover:text-white">Cancel</span>
          </motion.button>

          <motion.button
            onClick={handleSendInvites}
            disabled={(activeTab === "email" && emails.length === 0) || loading}
            className="group relative px-6 py-2 overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-md" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-50" />
            <span className="relative z-10 flex items-center justify-center text-white font-medium">
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="mr-2 h-4 w-4" />
                  {activeTab === "email" ? "Send Invites" : activeTab === "link" ? "Create Link" : "Share"}
                </span>
              )}
            </span>
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
