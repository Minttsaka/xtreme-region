'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, } from 'framer-motion'
import { format } from 'date-fns'
import { Calendar, Clock, Users, Settings, Globe, MoreVertical, ChevronRight, CreditCard, BookOpen,  MessageSquare, Camera, Bell, Star, Group } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {  AccessLevel, CourseList } from '@/types/course'
import { LessonsSection } from './LessonsSection'
import { Notification } from '@prisma/client'
import Link from 'next/link'
import { Input } from '../ui/input'
import { CustomButton } from '../ui/CustomButton'
import { editAccessLevelCourse, editCourse } from '@/app/actions/actions'
import { useRouter } from 'next/navigation'
import { Label } from '../ui/label'
import { uploadFileTos3 } from '@/lib/aws'
import { deleteCourse, removethumbPhoto, updateCourseImage } from '@/app/actions/channel'
import { ReviewSection } from '../channelpage/ReviewSection'
import { CourseUser, Review } from '@/types/channel'
import { ReviewForm } from '../channelpage/ReviewForm'
import AnnouncementModal from './AnnouncementModal'
import EnrollmentList from './EnrollmentList'
import { InviteCourseCollaboration } from './InviteCourseCollabo'
import { toast } from 'sonner'


interface AccessOption {
  value: AccessLevel
  label: string
  description: string
  icon: React.ElementType
  color: string
}


const AccessLevelBadge = ({ level }: { level: AccessLevel }) => {
  const colors = {
    REGISTERED_USERS: 'bg-blue-100 text-blue-800',
    PUBLIC: 'bg-green-100 text-green-800',
    ENROLLED_ONLY: 'bg-purple-100 text-purple-800'
  }

  return (
    <Badge variant="secondary" className={`${colors[level]} flex items-center gap-1`}>
      <span className="capitalize">{level}</span>
    </Badge>
  )
}

export default function CourseDisplay({ course , user }:{ course:CourseList , user: CourseUser | null }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState<{title:string, content:string}>({title:'', content:''})
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("PUBLIC")
  const [price, setPrice] = useState<string>("0")
  const [isUpdating,setIsUpdating] = useState(false)
  const [thumbnail, setThumbnail] = useState<string>()
  const [reviews , setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  useEffect(()=>{
    setAccessLevel(course.accessLevel)
    setThumbnail(course.thumbnail as string)
    setReviews(course.review)
    setNotifications(course.notification)
  },[])

  const accessOptions: AccessOption[] = [
    {
      value: "PUBLIC",
      label: "Channel Subscribers",
      description: "Only your channel subscribers can access this content",
      icon: Users,
      color: "from-blue-500 to-cyan-400",
    },
    {
      value: "REGISTERED_USERS",
      label: "Public",
      description: "Anyone can access this content for free",
      icon: Globe,
      color: "from-green-500 to-emerald-400",
    },
    // {
    //   value: "ENROLLED_ONLY",
    //   label: "Premium",
    //   description: "Paid access only - set your price below",
    //   icon: CreditCard,
    //   color: "from-purple-600 to-pink-500",
    // },
  ]

   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setEditedItem({ ...editedItem, [name]: value })
    }

    const router = useRouter()

    const saveChanges = async() => {

      try {
        await editCourse(course.id, editedItem.title, editedItem.content)
        
      } catch (error) {
        console.error(error)
        
      } finally{
        setIsEditing(false)
        router.refresh()
      }
 
    }

    const onUpdateAcccessLevel = async () => {
      try {
        setIsUpdating(true)
        await editAccessLevelCourse(course.id, accessLevel, price)
      } catch (error) {
        console.error(error)
        
      }finally{
        setIsUpdating(false)
      }
    }

    const handleProfileImageUpdate = async (file: File) => {
      try {
        setIsUpdating(true);
  
        const data = await uploadFileTos3(file);
        router.refresh();
      
        if(data){
          const image = await updateCourseImage(course.id, data.url as string);
          setThumbnail(image as string)
        }
        
      } catch (error) {
        console.error("Failed to upload image:", error);
        throw error;
      } finally {
          setIsUpdating(false);
        }
    };

    const priorityColors = {
      HIGH: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
      LOW: "from-green-500/10 to-emerald-500/10 border-green-500/20",
      NORMAL: "from-orange-500/10 to-yellow-500/10 border-orange-500/20",
      URGENT: "from-red-500/10 to-pink-500/10 border-red-500/20",
    }

    async function handleDeleteCourse() {
 
    try {
      const result = await deleteCourse(course.id)
      
      if (result.success) {
        toast(result.message)
        window.location.href = `/i/channel`
    
      } else {
        toast(result.message)
      }
    } catch (error) {
      toast.error("An error occurred while deleting the course")
    } 
  }

  async function handleRemoveProfile() {
 
    try {
      const result = await removethumbPhoto(course.id)
      
      if (result.success) {
        toast(result.message)
        window.location.href = `/i/channel`
    
      } else {
        toast(result.message)
      }
    } catch (error) {
      toast.error("An error occurred while deleting the course")
    } 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="md:container mx-auto md:py-8 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Course Header */}
         <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
              {/* Main Content */}
              <div className="flex-1 space-y-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-none w-fit">
                  {course.createdAt.toString()}
                </Badge>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight text-white drop-shadow-2xl">
                  {course.title}
                </h1>
                
                {/* Author and Course Info */}
                <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-6">
                  {/* Author Info */}
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                      <AvatarImage src={user.image}  />
                      <AvatarFallback className="text-xs sm:text-sm">SW</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm sm:text-base">{'miracle tsaka'}</p>
                      <p className="text-xs text-white/80">{'web developer'}</p>
                    </div>
                  </div>
                  
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">
                        {format(new Date(course.startDate!), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{course.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{course.participants} enrolled</span>
                    </div>
                    
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between lg:justify-end gap-2 lg:flex-col lg:items-end lg:gap-2">
                <AccessLevelBadge level={course.accessLevel} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white hover:bg-white/20 p-2"
                    >
                      <MoreVertical className="w-4 h-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsInviteDialogOpen(true)}>
                      Invite Collabo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteCourse} className="text-red-600">
                      Delete Course
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <InviteCourseCollaboration course = {course} isOpen={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />

          {/* Action Buttons */}
          <div className="flex gap-4">
          <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 transition-all hover:bg-slate-100 hover:text-slate-900">
          <Settings className="h-4 w-4" />
          Access Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Content Access Settings
          </DialogTitle>
          <DialogDescription>Control who can access your content and how they can interact with it.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid gap-4">
            {accessOptions.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                  accessLevel === option.value ? "border-2 shadow-lg" : "border border-slate-200 hover:border-slate-300"
                }`}
                style={{
                  borderImage:
                    accessLevel === option.value
                      ? `linear-gradient(to right, ${option.color.split(" ")[1]}, ${option.color.split(" ")[3]}) 1`
                      : "none",
                }}
              >
                <label htmlFor={`access-${option.value}`} className="flex cursor-pointer items-start gap-4 p-4">
                  <div className={`rounded-full p-2 bg-gradient-to-br ${option.color} text-white`}>
                    <option.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{option.label}</p>
                    <p className="text-sm text-slate-500">{option.description}</p>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                    {accessLevel === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`h-3 w-3 rounded-full bg-gradient-to-r ${option.color}`}
                      />
                    )}
                  </div>
                  <input
                    type="radio"
                    id={`access-${option.value}`}
                    name="access"
                    value={option.value}
                    checked={accessLevel === option.value}
                    onChange={() => setAccessLevel(option.value)}
                    className="sr-only"
                  />
                </label>
              </motion.div>
            ))}
          </div>

          {accessLevel === "ENROLLED_ONLY" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 rounded-lg border border-purple-200 bg-purple-50 p-4"
            >
              <Label htmlFor="price" className="text-sm font-medium text-purple-900">
                Set your premium price
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-500 sm:text-sm">$</span>
                </div>
                <Input
                  id="price"
                  type="number"
                  min="0.99"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-7 pr-12 focus:border-purple-500 focus:ring-purple-500"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-slate-500 sm:text-sm">USD</span>
                </div>
              </div>
              <p className="text-xs text-purple-600">
                Youll receive approximately ${(Number.parseFloat(price) * 0.85).toFixed(2)} after platform fees
              </p>
            </motion.div>
          )}
        </div>
        <div className="flex justify-end">
          <CustomButton disabled={isUpdating} onClick={onUpdateAcccessLevel} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
            Save Settings
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
          </div>

          {/* Course Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 space-y-6">
              <Card className="border-none bg-white/90 backdrop-blur-sm shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className='mt-10'>
                    {/* Mobile-responsive TabsList with decorations */}
                  <TabsList className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 p-1 sm:p-2 rounded-xl backdrop-blur-sm">
                  <TabsTrigger 
                    value="overview"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-base transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-700 data-[state=active]:border data-[state=active]:border-purple-200 hover:bg-white/50"
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Overview</span>
                    <span className="sm:hidden">Info</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="announcement"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-base transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-700 data-[state=active]:border data-[state=active]:border-purple-200 hover:bg-white/50"
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Annoucements</span>
                    <span className="sm:hidden">announcement</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="discussion"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-base transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-700 data-[state=active]:border data-[state=active]:border-purple-200 hover:bg-white/50"
                  >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Comments / Reviews</span>
                    <span className="sm:hidden">Reviews</span>
                  </TabsTrigger>

                   <TabsTrigger 
                    value="enroll"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-base transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-700 data-[state=active]:border data-[state=active]:border-purple-200 hover:bg-white/50"
                  >
                    <Group className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Enrollment</span>
                    <span className="sm:hidden">Enrollment</span>
                  </TabsTrigger>
                </TabsList>

                    {/* Tab Content with enhanced styling */}
                    <div className="mt-20">
                      <TabsContent 
                        value="overview" 
                        className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-lg"
                      >
                        <div className="space-y-6">
                          {/* Overview Header */}
                          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <BookOpen className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Course Overview</h3>
                              <p className="text-sm text-gray-600">Learn about this course and its lessons</p>
                            </div>
                          </div>
                          
                          {/* Course Description */}
                          <div className="prose max-w-none prose-sm sm:prose-base">
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-purple-100">
                              <p className="text-gray-700 leading-relaxed">
                                {course.content || "Explore the comprehensive curriculum designed to enhance your skills and knowledge in this subject area."}
                              </p>
                            </div>
                          </div>
                          
                          {/* Lessons Section */}
                          <LessonsSection course={course} />
                        </div>
                      </TabsContent>

                      <TabsContent 
                        value="announcement" 
                        className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-lg"
                      >
                        <div className="space-y-6">
                          {notifications.map(notification =>(
                            <div  key={notification.id} className="">
                              <div
                                className={` border bg-gradient-to-r ${priorityColors[notification.priority as keyof typeof priorityColors]} backdrop-blur-xl animate-in slide-in-from-top-2 duration-300`}
                              >
                                <div className="p-6">
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-3">
                                        <h3 className="text-xl font-bold text-slate-800">{notification.title}</h3>
                                        {notification.isPinned && (
                                          <Badge variant="secondary" className="bg-white/40 text-slate-700">
                                            <Star className="h-3 w-3 mr-1" />
                                            Pinned
                                          </Badge>
                                        )}
                                        {notification.priority ==="HIGH" && (
                                          <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/30">
                                            Urgent
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="prose prose-sm max-w-none">
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                          {notification.content}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        
                        </div>
                      </TabsContent>

                      <TabsContent 
                        value="discussion" 
                        className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-lg"
                      >
                        <div className="space-y-6">
                          {/* Discussion Header */}
                           <ReviewSection user={user} setReviews={setReviews} reviews={reviews} onWriteReview={() => setShowReviewForm(true)} />
                            {showReviewForm && <ReviewForm setReviews={setReviews} courseId={course.id} onClose={() => setShowReviewForm(false)} />}
                        </div>
                      </TabsContent>

                      <TabsContent 
                        value="enroll" 
                        className="mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-lg"
                      >
                        <EnrollmentList 
                        EnrollmentList={course.enrollment.filter(en => en.courseId === course.id)} 
                        lessons={course.lessons.length} />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href={`/channels/course/${course.id}`} className="w-full">
                        <Button 
                          variant="ghost" 
                          className="w-full group/button bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 text-slate-700 border border-white/60 rounded-xl h-11"
                        >
                          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent font-medium">Preview Course</span>
                          <div className="relative ml-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full w-5 h-5 flex items-center justify-center group-hover/button:translate-x-1 transition-transform">
                            <ChevronRight className="h-3 w-3 text-white" />
                          </div>
                        </Button>
                      </Link>
                       
                        <AnnouncementModal courseId={course.id} setNotifications={setNotifications} />
                      <Button
                        onClick={() => setIsEditing((prev)=>!prev)}
                        variant="ghost" 
                        className="w-full group/button bg-gradient-to-r from-sky-50 to-indigo-50 hover:from-sky-100 hover:to-indigo-100 text-slate-700 border border-white/60 rounded-xl h-11"
                        >
                          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent font-medium">Edit Course</span>
                          <div className="relative ml-2 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full w-5 h-5 flex items-center justify-center group-hover/button:translate-x-1 transition-transform">
                            <ChevronRight className="h-3 w-3 text-white" />
                          </div>
                        </Button>
                      
               
                </CardContent>
              </Card>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit course details</DialogTitle>
                    <DialogDescription>Make yourself unique.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="title" className="text-right text-sm font-medium">
                        Title
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={editedItem.title}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="duration" className="text-right text-sm font-medium">
                        Description
                      </label>
                      <Input
                        id="duration"
                        name="content"
                        value={editedItem.content}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <CustomButton variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </CustomButton>
                    <CustomButton onClick={saveChanges}>Save Changes</CustomButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Card className="bg-gradient-to-br from-green-400 to-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center text-white font-normal gap-2">
                    <Camera className="w-5 h-5" />
                    Course Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage className="object-cover" src={thumbnail ?? course.thumbnail as string} />
                      <AvatarFallback>CS</AvatarFallback>
                    </Avatar>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            await handleProfileImageUpdate(file);
                        
                          } catch (error) {
                            console.error("Upload failed:", error);
                          }
                        }
                      }}
                    />

                    <div className="space-y-2">
                      <CustomButton
                      disabled={isUpdating}
                        className="w-full flex items-center justify-center text-white"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload New Photo
                      </CustomButton>

                      <CustomButton
                      onClick={handleRemoveProfile}
                        variant="ghost"
                        className="w-full text-white hover:text-red-500"
                      >
                        Remove Photo
                      </CustomButton>
                    </div>

                    <p className="text-xs text-white text-center">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

