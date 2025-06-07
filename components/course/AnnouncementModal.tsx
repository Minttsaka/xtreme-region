"use client"

import { Dispatch, SetStateAction, useState,} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bell, Send, Star, AlertCircle, Info, Clock, Users, ChevronRight, CheckCircle } from "lucide-react"
import { Notification } from "@prisma/client"

export default function AnnouncementModal({
   
}:{
    courseId:string, 
    setNotifications: Dispatch<SetStateAction<Notification[]>>
}) {
   const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [priority, setPriority] = useState("NORMAL")
  const [isPinned, setIsPinned] = useState(false)
  const [category, setCategory] = useState("GENERAL")
  const [targetAudience, setTargetAudience] = useState("PUBLIC")
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [successMessage, setSuccessMessage] = useState("")

  const priorityConfig = {
    low: { label: "LOW", icon: Info, color: "bg-blue-50 border-blue-200 text-blue-700" },
    normal: { label: "NORMAL", icon: Bell, color: "bg-green-50 border-green-200 text-green-700" },
    high: { label: "HIGH", icon: AlertCircle, color: "bg-orange-50 border-orange-200 text-orange-700" },
    urgent: { label: "URGENT", icon: AlertCircle, color: "bg-red-50 border-red-200 text-red-700" },
  }

  const categories = [
    { value: "GENERAL", label: "General" },
    { value: "ASSIGNMENT", label: "Assignment" },
    { value: "EXAM", label: "Exam/Quiz" },
    { value: "SCHEDULE", label: "Schedule" },
    { value: "rRESOURCE", label: "Resources" },
  ]

  const audiences = [
    { value: "PUBLIC", label: "All " },
    { value: "REGISTERED_USERS", label: "Subscribed" },
    { value: "ENROLLED_ONLY", label: "Paid" },
  ]

  const currentPriority = priorityConfig[priority as keyof typeof priorityConfig]


  const handleSend = () => {
    setSuccessMessage('')
    setErrors({})
 
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <div className=" ">
      {/* Course Dashboard Header */}
       <Dialog  open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button 
            variant="ghost" 
            className="w-full group/button bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 text-slate-700 border border-white/60 rounded-xl h-11"
        >
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent font-medium">Send Announcement</span>
            <div className="relative ml-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full w-5 h-5 flex items-center justify-center group-hover/button:translate-x-1 transition-transform">
            <ChevronRight className="h-3 w-3 text-white" />
            </div>
        </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-100">
            <DialogHeader>
            <DialogTitle className="text-sm text-gray-800 mb-4">Create New Announcement</DialogTitle>
            </DialogHeader>
            <div>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700 font-medium">
                        Title *
                    </Label>
                    <Input
                        id="title"
                        placeholder="Enter announcement title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white shadow border-none outline-none focus:border-none"
                    />
                    </div>

                    <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger className="bg-white shadow border-none outline-none focus:border-none rounded-full">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="LOW">Low Priority</SelectItem>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="HIGH">High Priority</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                    <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-white shadow border-none outline-none focus:border-none rounded-full">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>

                    <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Target Audience</Label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                        <SelectTrigger className="bg-white shadow border-none outline-none focus:border-none rounded-full">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        {audiences.map((audience) => (
                            <SelectItem key={audience.value} value={audience.value}>
                            {audience.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="content" className="text-gray-700 font-medium">
                        Content *
                    </Label>
                    <Textarea
                        id="content"
                        placeholder="Write your announcement content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[120px] bg-white shadow border-none outline-none focus:border-none rounded-xl focus:border-blue-400 resize-none"
                    />
                    </div>

                    <Card className="bg-white/50 border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                        <Label className="text-gray-700 font-medium">Options</Label>
                        </div>
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">Pin to top</span>
                        </div>
                        <Switch checked={isPinned} onCheckedChange={setIsPinned} />
                        </div>
                    </CardContent>
                    </Card>

                    {title || content ? (
                    <div className={`rounded-lg border p-4 ${currentPriority?.color}`}>
                        <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{title || "Announcement Title"}</h3>
                            {isPinned && (
                                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                <Star className="h-3 w-3 mr-1" />
                                Pinned
                                </Badge>
                            )}
                            </div>
                            <p className="text-sm leading-relaxed mb-3">
                            {content || "Your announcement content will appear here..."}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Just now
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                Prof. Johnson
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>Start typing to see preview</p>
                    </div>
                    )}
                </div>
                </div>

                
                </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button onClick={handleCancel} variant="outline" className="flex-1">
                Cancel
            </Button>
            <Button onClick={handleSend} className="flex-1 bg-blue-500 hover:bg-blue-600">
                <Send className="h-4 w-4 mr-2" />
                Send Announcement
            </Button>
            </div>
             {successMessage && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
                )}

                {/* General Error */}
                {errors.general && (
                <Alert className="bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general[0]}</AlertDescription>
                </Alert>
                )}

        </DialogContent>
        </Dialog>
    </div>
  )
}
