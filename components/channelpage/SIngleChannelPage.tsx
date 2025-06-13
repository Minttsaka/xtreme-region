
"use client"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Users, Eye, ThumbsUp, Clock, Calendar, Star,  Heart,Bell, CheckCircle, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { singleChannel } from "@/types/channel"
import { addViewToChannel, likeToChannel, subscribeToChannel, unlikeFromChannel, unsubscribeFromChannel } from "@/app/actions/channel"
import { CustomButton } from "../ui/CustomButton"
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

function ChannelSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-64 bg-gray-200 rounded-3xl"></div>
      <div className="flex gap-6">
        <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
        <div className="space-y-3 flex-1">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-80 bg-gray-200 rounded-3xl"></div>
        ))}
      </div>
    </div>
  )
}

export default function ChannelPage({ channel }: { channel: singleChannel }) {
  return (
    <Suspense fallback={<ChannelSkeleton />}>
      <ChannelContent channel={channel} />
    </Suspense>
  )
}


function ChannelContent({ channel}: { channel: singleChannel }) {

  const [isSubscribed, setIsSubscribed] = useState<boolean>()
  const [likes, setLikes] = useState<number>(0)
  const [views, setViews] = useState<number>(0)
  const [isLiked, setIsLiked] = useState<boolean>()
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

  useEffect(() => {
    fetchUser()

    if (user) {
      handleViews()
      const subscribed = channel.subscriptions.find((sub) => sub.userId === user?.id)
      const likesList = channel.likes.find((like) => like.userId === user?.id)
      if (subscribed) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }

        if (likesList) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      setLikes(channel._count.likes)
      setViews(channel._count.views)
    }
  }, [user])

  const totalRatings = channel._count.rating
  const averageRating =
    totalRatings > 0 ? channel.rating.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings : 0

     const subscribeChannel = async () => {
        const res = await subscribeToChannel(channel.id)
        if (res) {
          setIsSubscribed(true)
        }
      }
    
      const unsubscribeChannel = async () => {
        const res = await unsubscribeFromChannel(channel.id)
        if (res) {
          setIsSubscribed(false)
        }
      }
    
      const handleSubscribe = async () => {
        if (!isSubscribed) {
          await subscribeChannel()
        } else {
          await unsubscribeChannel()
        }
      }

      const handleViews = async () => {
        try {
          await addViewToChannel(user?.id, channel.id)
        } catch (error) {
          console.error(error)
          
        }
      }

      const handleLike = async () => {
        if (!isLiked) {
           const res = await likeToChannel(channel.id)
        if (res) {
          setIsLiked(true)
          setLikes(likes + 1)
        }
        } else {
          const res = await unlikeFromChannel(channel.id)
        if (res) {
          setIsLiked(false)
          setLikes(likes - 1)
        }
        }
      }

  return (
    <main className="container mx-auto px-4 py-20  ">
      {/* Hero Section */}
        <div className="relative w-full  min-h-64 md:min-h-80 py-20 rounded-3xl overflow-hidden mb-12 group">
          {/* Background Image/Thumbnail */}
          <div className="absolute inset-0">
            <img 
              src={channel.thumbnail || "/placeholder.svg?height=320&width=800"} 
              alt={`${channel.name} thumbnail`}
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

          {/* Stats badges with enhanced styling */}
          <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm border border-emerald-400/30 text-white shadow-lg hover:bg-emerald-400/90 transition-all duration-300">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{channel._count.subscriptions.toLocaleString()}</span>
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
          {channel.isFeatured && (
            <div className="absolute top-6 left-6 z-20">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Badge className="flex items-center gap-2 bg-blue-500/90 backdrop-blur-sm border border-blue-400/30 text-white shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">Featured</span>
                </Badge>
              </motion.div>
            </div>
          )}

          {/* Main content */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >

              {/* Channel name with enhanced typography */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight mb-3 text-white drop-shadow-2xl"
                style={{
                  textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                {channel.name}
              </motion.h1>

              {/* Description with better styling */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/90 max-w-2xl leading-relaxed drop-shadow-lg"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}
              >
                {channel.description}
              </motion.p>

              {/* Enhanced action buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center flex-wrap gap-4"
              >
                 <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user ? (
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -2 }} 
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <CustomButton
                        onClick={handleSubscribe}
                        className={`relative overflow-hidden h-14 px-8 rounded-2xl font-bold text-base transition-all duration-500 shadow-xl ${
                          isSubscribed
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white border-2 border-emerald-400"
                            : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-2 border-red-400"
                        }`}
                      >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        
                        <div className="relative flex items-center justify-center space-x-2">
                          {isSubscribed ? (
                            <>
                              <span>SUBSCRIBED</span>
                            </>
                          ) : (
                            <>
                              <span>SUBSCRIBE</span>
                            </>
                          )}
                        </div>
                      </CustomButton>
                    </motion.div>
                  ) : (
                    <div onClick={(e) => e.stopPropagation()}>
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -2 }} 
                          whileTap={{ scale: 0.95 }}
                          className="relative"
                        >
                          <CustomButton
                          onClick={()=>signIn()} className="relative overflow-hidden h-14 px-8 rounded-2xl font-bold text-base bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border-2 border-slate-500/50 transition-all duration-500 shadow-xl">
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            
                            <div className="relative flex items-center justify-center space-x-2">
                              <span>LOGIN TO SUBSCRIBE</span>
                            </div>
                          </CustomButton>
                        </motion.div>
                    </div>
                  )}
                    
                  </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                  {user ? (
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -2 }} 
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <Button
                      onClick={handleLike}
                      className={`h-14 px-8 rounded-2xl font-bold text-base backdrop-blur-sm border-2 transition-all duration-300 shadow-xl ${
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
                        {channel._count.likes > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-0 ml-1">
                            {channel._count.likes.toLocaleString()}
                          </Badge>
                        )}
                      </motion.div>
                    </Button>
                    </motion.div>
                  ) : (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Button
                      onClick={()=>signIn()}
                      className={`h-14 px-8 rounded-2xl font-bold text-base backdrop-blur-sm border-2 transition-all duration-300 shadow-xl ${
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
                        <span>LOGIN TO LIKE</span>
                        {channel._count.likes > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-0 ml-1">
                            {channel._count.likes.toLocaleString()}
                          </Badge>
                        )}
                      </motion.div>
                    </Button>
                    </div>
                  )}
                </motion.div>

               

              </motion.div>

              {/* Channel stats summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex items-center gap-6 text-white/80 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(channel.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                
              </motion.div>
            </motion.div>
          </div>

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

      {/* Instructor Profile */}
      <div className="flex flex-col md:flex-row gap-8 mb-16 items-start">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img
              src={channel.user.image || "/placeholder.svg"}
              alt={channel.user.name as string}
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
              <h2 className="text-2xl font-bold text-gray-900">{channel.user.name}</h2>
              <p className="text-violet-600 font-medium">{channel.user.bio}</p>
            </div>
            {channel.user.isVerified && <Badge
              variant="outline"
              className="ml-0 bg-blue-500 md:ml-auto w-fit px-3 py-1 border-2 border-violet-200 text-white font-medium"
            >
              Verified Instructor
            </Badge>}
          </div>
          <Badge
              variant="outline"
              className="ml-0 md:ml-auto w-fit px-3 py-1 border-2 border-violet-200 text-violet-700 font-medium"
            >
              {channel.user.career}
            </Badge>
         
          <div className="flex gap-4 mt-5">
            <CustomButton      
          >
              Contact
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Courses Section */}
     <div className="mb-8">
        {channel.courses && channel.courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {channel.courses.map((course) => (

                <Card key={course.id} className="overflow-hidden border-0 bg-white shadow rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-violet-100 h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      width={640}
                      height={360}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-3 py-1">
                        {course.accessLevel}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.content}</p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{averageRating}</span>
                        </div>
                        <div className="text-xl font-bold text-violet-700">${course.amount}</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50">
                          <Calendar className="w-4 h-4 text-violet-500 mb-1" />
                          <span className="text-gray-700 text-xs">{formatDate(course.startDate)}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50">
                          <Clock className="w-4 h-4 text-violet-500 mb-1" />
                          <span className="text-gray-700 text-xs">{formatDuration(course.duration)}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50">
                          <Users className="w-4 h-4 text-violet-500 mb-1" />
                          <span className="text-gray-700 text-xs">{course.participants}</span>
                        </div>
                      </div>
                      <Link href={`/channels/course/${course.id}`} key={course.id} className="group">
                        <Button className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl py-5 font-medium shadow-md shadow-violet-100 transition-all hover:shadow-lg hover:shadow-violet-200">
                          Enroll Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              
            ))}
          </div>
        ) : (
          // Empty state indicator
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-16 px-8"
          >
            <div className="relative mb-8">
              {/* Animated background circles */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full blur-xl"
              ></motion.div>
              
              <motion.div
                animate={{ 
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
                className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-xl"
              ></motion.div>

              {/* Main icon */}
              <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <BookOpen className="w-16 h-16 text-violet-500" />
                </motion.div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  x: [0, 5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg"
              ></motion.div>

              <motion.div
                animate={{ 
                  y: [0, 8, 0],
                  x: [0, -3, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-1 -left-3 w-4 h-4 bg-pink-400 rounded-full shadow-lg"
              ></motion.div>

              <motion.div
                animate={{ 
                  y: [0, -6, 0],
                  x: [0, 8, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
                className="absolute top-8 -left-4 w-3 h-3 bg-green-400 rounded-full shadow-lg"
              ></motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center space-y-4 max-w-md"
            >
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight text-gray-800 mb-2">No Courses Yet</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                This channel hasnt published any courses yet. Check back soon for exciting new content!
              </p>
              
              {/* Additional info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
                <div className="flex items-center justify-center gap-2 text-violet-700 mb-2">
                  <Bell className="w-5 h-5" />
                  <span className="font-semibold">Stay Updated</span>
                </div>
                <p className="text-sm text-violet-600">
                  Subscribe to get notified when new courses are available
                </p>
              </div>
            </motion.div>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <motion.div
                animate={{ 
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  opacity: [0, 0.1, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-10 left-10 w-2 h-2 bg-violet-400 rounded-full"
              ></motion.div>
              
              <motion.div
                animate={{ 
                  x: [0, -80, 0],
                  y: [0, 60, 0],
                  opacity: [0, 0.15, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute bottom-20 right-20 w-3 h-3 bg-purple-400 rounded-full"
              ></motion.div>
            </div>
          </motion.div>
        )}
      </div>

    </main>
  )
}
