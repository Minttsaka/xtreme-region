"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Star,
  AlertCircle,
  Info,

} from "lucide-react"
import { Prisma } from "@prisma/client"

type Notification = Prisma.NotificationGetPayload<{
  include:{
    author:true
  }
}>

export default function Announcements({ announcement }:{ announcement:Notification}) {
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null)

  const priorityColors = {
    LOW: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    NORMAL: "from-green-500/10 to-emerald-500/10 border-green-500/20",
   HIGH: "from-orange-500/10 to-yellow-500/10 border-orange-500/20",
    URGENT: "from-red-500/10 to-pink-500/10 border-red-500/20",
  }

  const priorityIcons = {
    LOW: Info,
    NORMAL: Bell,
    HIGH: AlertCircle,
    URGENT: AlertCircle,
  }

  const toggleAnnouncement = (id: string) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id)
  }

  const PriorityIcon = priorityIcons[announcement.priority as keyof typeof priorityIcons]
  const isExpanded = expandedAnnouncement === announcement.id

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Announcements Section - Fixed at top */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b">
        <div className="max-w-6xl mx-auto p-4">
          <div className="space-y-2">
            <div key={announcement.id} className="relative">
                  {/* Collapsed View */}
                  <div
                    className={`relative overflow-hidden rounded-xl border bg-gradient-to-r ${priorityColors[announcement.priority as keyof typeof priorityColors]} cursor-pointer transition-all duration-300 hover:shadow-lg`}
                    onClick={() => toggleAnnouncement(announcement.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="p-2 rounded-lg bg-white/30 backdrop-blur-sm">
                            <PriorityIcon
                              className={`h-4 w-4 ${announcement.priority === "HIGH" ? "text-red-600" : announcement.priority === "LOW" ? "text-orange-600" : "text-slate-600"}`}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-800 truncate">{announcement.title}</h3>
                            {announcement.isPinned && (
                              <Badge variant="secondary" className="bg-white/40 text-slate-700 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Pinned
                              </Badge>
                            )}
                            {announcement.priority === "URGENT" && (
                              <Badge
                                variant="destructive"
                                className="bg-red-500/20 text-red-700 border-red-500/30 text-xs"
                              >
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm truncate">{announcement.content}</p>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <span className="text-xs">{announcement.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Overlay */}
                  {isExpanded && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1">
                      <div
                        className={`rounded-xl border bg-white backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-2 duration-300`}
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="p-3 rounded-xl bg-white/40 backdrop-blur-sm">
                                <PriorityIcon
                                  className={`h-6 w-6 ${announcement.priority === "LOW" ? "text-red-600" : announcement.priority === "HIGH" ? "text-orange-600" : "text-slate-600"}`}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-xl font-bold text-slate-800">{announcement.title}</h3>
                                {announcement.isPinned && (
                                  <Badge variant="secondary" className="bg-white/40 text-slate-700">
                                    <Star className="h-3 w-3 mr-1" />
                                    Pinned
                                  </Badge>
                                )}
                                {announcement.priority === "URGENT" && (
                                  <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/30">
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                              <div className="prose prose-sm max-w-none">
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                  {announcement.content}
                                </p>
                              </div>
                              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                                <span>
                                  By {announcement.author.name} • 
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleAnnouncement(announcement.id)
                                  }}
                                  className="text-slate-600 hover:text-slate-800"
                                >
                                  <ChevronUp className="h-4 w-4 mr-1" />
                                  Collapse
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
          </div>
        </div>
      </div>
    </div>
  )
}
