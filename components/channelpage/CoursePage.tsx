"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Clock, Calendar, BookOpen, Award, Eye, ThumbsUp, CheckCircle, Heart, Loader2, Shield, Star, Lock, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {  Review, SingleCourse } from "@/types/channel"
import { ReviewSection } from "./ReviewSection"
import { ReviewForm } from "./ReviewForm"
import { CustomButton } from "../ui/CustomButton"
import { addViewToCourse, handleEnrollToCourse, likeToCourse, unlikeFromCourse } from "@/app/actions/channel"
import { Prisma } from "@prisma/client"
import { signIn } from "next-auth/react"

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  return `${hours} hours`
}

type Lesson = Prisma.LessonGetPayload<{
  include:{
    rating:true,
    resources:{
      include:{
        resource:true
      }
    },
    _count:{
      select:{
        views:true
      }
    }
  }
}>

function CourseSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-96 bg-gray-200 rounded-3xl"></div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
          </div>
        </div>
        <div className="lg:w-1/3 h-64 bg-gray-200 rounded-3xl"></div>
      </div>
    </div>
  )
}

function LessonCard({
  lesson,
  gradientFrom,
  gradientTo,
  isCompleted
}: { lesson: Lesson; gradientFrom: string; gradientTo: string ,isCompleted: boolean }) {

  const totalRatings = lesson.rating.length

  const averageRating =
      totalRatings > 0 ? lesson.rating.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings : 0

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-shrink-0 w-[280px] snap-start group"
    >
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900 border-0">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${lesson.thumbnail || "/placeholder.svg?height=400&width=280"})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom}/20 to-${gradientTo}/20`} />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 h-[280px] flex flex-col justify-between text-white">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            {lesson.accessLevel && (
              <Badge className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white border-0 backdrop-blur-sm shadow-lg`}>
                <Lock className="h-3 w-3 mr-1" />
                {lesson.accessLevel}
              </Badge>
            )}
            <Badge className="bg-black/30 backdrop-blur-sm text-white border-white/20">
              <Clock className="h-3 w-3 mr-1" />
              {lesson.duration} min
            </Badge>
          </div>

          {/* Middle Section */}
          <div className="flex-1 flex flex-col justify-end">
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
              {lesson.title}
            </h3>

            {/* Status info */}
            <div className="flex items-center mb-3">
              <div className="relative">
              <span className="text-sm text-white/90 line-clamp-1 ml-2">{isCompleted ? <Check className="text-green-500" /> : <AlertTriangle className="text-green-500" />}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-white/80">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md">
                <Eye className="h-3 w-3" />
                <span>{lesson._count.views || 0} views</span>
              </div>

              {lesson.rating && (
                <div className="flex items-center gap-1 bg-amber-500/20 backdrop-blur-sm px-2 py-1 rounded-md">
                  <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                  <span>{averageRating.toFixed(1)}</span>
                </div>
              )}

              <div className="flex items-center gap-1 bg-blue-500/20 backdrop-blur-sm px-2 py-1 rounded-md">
                <Shield className="h-3 w-3 text-blue-400" />
                <span>{lesson.accessLevel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-${gradientFrom}/20 to-${gradientTo}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Bottom gradient accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
        </div>
      </div>
    </motion.div>
  )
}


export default function CoursePage({ course }: { course: SingleCourse}) {
  return (
    <Suspense fallback={<CourseSkeleton />}>
      <CourseContent course={course} />
    </Suspense>
  )
}

function CourseContent({ course }: { course: SingleCourse }) {
  const [isEnrolled, setIsEnrolled] = useState<boolean>()
  const [likes, setLikes] = useState<number>(0)
  const [views, setViews] = useState<number>(0)
  const [isLiked, setIsLiked] = useState<boolean>()
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews , setReviews] = useState<Review[]>([])
  const [user, setUser] = useState<null | Record<string, any>>(null)

      const fetchUser = async () => {
        try {
          const res = await fetch("/api/public-user")
          const data = await res.json()
          setUser(data.user)
        } catch (err) {
          console.error("Failed to fetch user:", err)
          setUser(null)
        } 
      }

  useEffect(()=>{
    fetchUser()
    const enrolled = course.enrollment.find((sub) => sub.userId === user?.id)
    const likesList = course.likes.find((like) => like.userId === user?.id)
    handleViews()
    setReviews(course.review)
    if (enrolled) {
        setIsEnrolled(true);
      } else {
        setIsEnrolled(false);
      }

      if (likesList) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }

    setLikes(course._count.likes)
    setViews(course._count.views)
  },[])

  const completionPercentage = Math.round(((user?.completeArena.length ?? 0) / course.lessons.length) * 100)

  const lessons = course.completeArena.filter((course) => course.type === "LESSON")
  const completedLessons = lessons?.filter(lesson => lesson.userId === user?.id)

  const handleEnroll = async () => {

      try {
        setIsEnrolling(true)
        const res = await handleEnrollToCourse(course.id)

        if(res?.status){
          setIsEnrolled(true)
          window.location.href = `/i/lesson/${course.lessons[completedLessons.length].id}/${course.id}`
        }
      } catch (error) {
        console.error(error)
      
    } finally {
      setIsEnrolling(false)
    }
          
  }
  
  const handleViews = async () => {
    try {

      await addViewToCourse(user?.id, course.id)
      
    } catch (error) {
      console.error(error)
      
    }
  }

  const handleLike = async () => {
    try {
      if (!isLiked) {
        const res = await likeToCourse(course.id)
        if (res) {
          setIsLiked(true)
          setLikes(likes + 1)
        }
        } else {
          const res = await unlikeFromCourse(course.id)
        if (res) {
          setIsLiked(false)
          setLikes(likes - 1)
        }
      }
      
    } catch (error) {
      console.error(error)
      
    }
  }

  const handleContinueLesson = () => {
    window.location.href = `/i/lesson/${course.lessons[completedLessons.length].id}/${course.id}`
  }

  return (
    <main className="container mx-auto px-4 py-20">
      <div className="relative w-full min-h-80 py-20 rounded-3xl overflow-hidden mb-12 group">
        {/* Background Image/Thumbnail */}
        <div className="absolute inset-0">
          <img 
            src={course.thumbnail || "/placeholder.svg?height=320&width=800"} 
            alt={`${course.title} thumbnail`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay gradients for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
          
          {/* Animated particles/dots overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-10 right-10 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
          </div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
   
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight mb-3 text-white drop-shadow-2xl">{course.title}</h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white">
            <div className="flex items-center gap-2">
              <Badge className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-3 py-1">
                {course.subjectToClass.subject?.name}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Users className="w-5 h-5 text-violet-300" />
              <span>{course.participants} Enrolled</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-5 h-5 text-violet-300" />
              <span>{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="w-5 h-5 text-violet-300" />
              <span>Starts {formatDate(course.startDate)}</span>
            </div>
          </div>
        </div>
      
          {/* Stats badges with enhanced styling */}
          <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm border border-emerald-400/30 text-white shadow-lg hover:bg-emerald-400/90 transition-all duration-300">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{course.enrollment.length}</span>
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="flex items-center gap-2 bg-purple-500/90 backdrop-blur-sm border border-purple-400/30 text-white shadow-lg hover:bg-purple-400/90 transition-all duration-300">
                <Eye className="w-4 h-4" />
                <span className="font-semibold">{views}</span>
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="flex items-center gap-2 bg-amber-500/90 backdrop-blur-sm border border-amber-400/30 text-white shadow-lg hover:bg-amber-400/90 transition-all duration-300">
                <ThumbsUp className="w-4 h-4" />
                <span className="font-semibold">{likes}</span>
              </Badge>
            </motion.div>
          </div>

          {/* Channel verification badge */}
          {course.isFeatured && (
            <div className="absolute top-6 left-6 z-20">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Badge className="flex items-center gap-2 bg-blue-500/90 backdrop-blur-sm border border-blue-400/30 text-white shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">Verified</span>
                </Badge>
              </motion.div>
            </div>
          )}

          {/* Main content */}


          {/* Floating elements for visual interest */}
          <div className="absolute bottom-4 left-4 opacity-20">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-8 h-8 border-2 border-white rounded-lg"
            ></motion.div>
          </div>

          <div className="absolute top-1/2 right-4 opacity-10">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="w-12 h-12 border border-white rounded-full"
            ></motion.div>
          </div>
        </div>

      {/* Course Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Course Details */}
        <div className="lg:w-2/3">
          {/* Instructor Info */}
          <div className="flex flex-col md:flex-row gap-8 mb-16 items-start">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img
              src={course.channel.user.image || "/placeholder.svg"}
              alt={course.channel.user.name as string}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="sr-only">Active</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{course.channel.user.name}</h2>
              <p className="text-gray-700 font-medium">{course.channel.user.bio}</p>
            </div>

          </div>
          <Badge
              variant="outline"
              className="ml-0 md:ml-auto w-fit px-3 py-1 border-2 border-violet-200 text-violet-700 font-medium"
            >
              {course.channel.user.career}
            </Badge>
         
        </div>
      </div>

       <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
            <p className="text-gray-700 leading-relaxed">{course.content}</p>
          </div>

          {course.lessons.length > 0 && <div>
            <h2 className="text-2xl font-bold mb-4">What Youll Learn</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-violet-600"></div>
                  </div>
                  <span>{lesson.title}</span>
                </li>
              ))}
            
            </ul>
          </div>}
        </div>
        <div  className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Course Curriculum</h2>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-600" />
              <span>{course.lessons.length} Lessons</span>
            </div>
          </div>
          {course.lessons.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <p className="text-gray-600 mb-4">No lessons available for this course yet.</p>
            </div>
          )}

          <div className="space-y-4 mb-10">
            {course.lessons.map((lesson, index) => (
              <LessonCard key={index} lesson={lesson} gradientFrom="ember-500" gradientTo="green-500" isCompleted = {completedLessons?.some(les => les.id === lesson.id)}  />
            ))}
          </div>
        </div>
          <ReviewSection user={user} setReviews={setReviews} reviews={reviews} onWriteReview={() => setShowReviewForm(true)} />
        </div>
         {showReviewForm && <ReviewForm setReviews={setReviews} courseId={course.id} onClose={() => setShowReviewForm(false)} />}

        {/* Right Column - Enrollment Card */}
        <div className="lg:w-1/3">
          <Card className="border-0 rounded-3xl overflow-hidden shadow-xl shadow-violet-100">
            <CardContent className="p-0">
              <div className="p-6 bg-gradient-to-br from-violet-600 to-violet-700 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold">${course.amount}</div>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                  {course.accessLevel === "REGISTERED_USERS" ? `Paid Only `: course.accessLevel === "ENROLLED_ONLY" ? "Subscribers Only" : "Every one" }
                  </Badge>
                </div>

                <div className="space-y-4">
                  {user ? isEnrolled ?
                  <Button className="w-full bg-green-500 text-violet-700 hover:bg-gray-100 rounded-xl py-6 font-medium text-lg">
                    Enllored
                  </Button>: 
                  <Button onClick={handleEnroll} disabled={isEnrolling} className="w-full bg-white text-violet-700 hover:bg-gray-100 rounded-xl py-6 font-medium text-lg">
                    {isEnrolling ? <Loader2 className=" animate-spin " /> : "Enroll Now"}
                  </Button> :
                  <Button onClick={()=>signIn()} className="w-full bg-gray-100  text-violet-700 hover:bg-gray-100 rounded-xl py-6 font-medium text-lg">
                    Signin to start
                  </Button> }

                 <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleLike}
                      className={`h-14 w-full px-8 rounded-2xl font-bold text-base backdrop-blur-sm border-2 transition-all duration-300 shadow-xl ${
                        isLiked 
                          ? "bg-red-500/90 border-red-400/50 text-white hover:bg-red-400/90" 
                          : "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                      }`}
                    >
                      <motion.div
                        animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2"
                      >
                        {isLiked ? (
                          <Heart className="w-5 h-5 fill-current" />
                        ) : (
                          <Heart className="w-5 h-5" />
                        )}
                        <span>{isLiked ? 'LIKED' : 'LIKE'}</span>
                        {course._count.likes > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-0 ml-1">
                            {course._count.likes.toLocaleString()}
                          </Badge>
                        )}
                      </motion.div>
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-medium mb-4">This Course Includes:</h3>

                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium">{formatDuration(course.duration)}</p>
                      <p className="text-sm text-gray-600">On-demand Lessons</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium">{course.lessons.length} Lessons</p>
                      <p className="text-sm text-gray-600">Structured curriculum</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium">Eligibility</p>
                      <p className="text-sm text-gray-600">
                        {course.accessLevel === "REGISTERED_USERS" ? `Those who have paid ${course.amount} `: course.accessLevel === "ENROLLED_ONLY" ? "Only users subcribed to the channel" : "Every one" }
                      </p>
                    </div>
                  </li>
                </ul>
                 {isEnrolled && course.lessons.length > 0 &&
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Your Progress</h3>
                      <span className="text-sm text-gray-600">{completionPercentage}% Complete</span>
                    </div>
                    <Progress
                      value={completionPercentage}
                      className="h-2 bg-gray-100"
                    />
                    <div className="mt-4 text-center">
                      <CustomButton onClick={handleContinueLesson}  hasArrow className="bg-green-500 text-white">Continue Learning</CustomButton>
                    </div>
                  </div>}
              
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
