"use client"
import React from "react"
import {
  Mail,
  MapPin,
  Phone,
  Briefcase,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserSettings } from "./ProfileSettings"
import { Prisma } from "@prisma/client"

type User = Prisma.UserGetPayload<{
   include: {
      staff: {
        include: {
          school: true
        }
      },
      completeArena: true,
      _count: {
        select: {
          channels: true,
          meetings: true,
        }
      }
    }
  }>

export default function ProfilePage({ user }: { user: User }) {

  const completedCourse = user.completeArena.map(course=>course.type === "COURSE");
  const completedLesson = user.completeArena.map(lesson=>lesson.type === "LESSON");

  return (
    <div className="min-h-screen">
      <div className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                  {/* User Profile Card */}
                  <div className="col-span-1">
                    <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 h-full">
                      <CardContent className="p-6 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-4">
                            <Avatar className="w-20 h-20 border-4 border-white/20">
                              <AvatarImage className="object-cover" src={user.image as string} />
                              <AvatarFallback>JW</AvatarFallback>
                            </Avatar>
                            <div>
                              <h2 className="text-xl font-semibold">{user.name}</h2>
                              <p className="text-blue-100 text-sm">{user.career}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-blue-200" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                         {user.currentQualification && <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-blue-200" />
                            <span className="text-sm">{user.currentQualification}</span>
                          </div>}
                         {user.address && <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-blue-200" />
                            <span className="text-sm">{user.address}</span>
                          </div>}
                          {user.phone && <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-blue-200" />
                            <span className="text-sm">{user.phone}</span>
                          </div>}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/20">
                         {user.bio && <div className="text-sm">
                            <span className="text-blue-200">Bio:</span>
                            <p className="mt-1 text-sm leading-relaxed">
                              {user.bio}
                            </p>
                          </div>}
                           {user.career && <div className="text-sm">
                            <span className="text-blue-200">Career:</span>
                            <p className="mt-1 text-sm leading-relaxed">
                              {user.career}
                            </p>
                          </div>}
                        </div>

                        <div className="pt-4 text-xs text-blue-200">Member since {user.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Panel */}
                  <div className="col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Classes Stats */}
                      <Card className="w-full bg-gradient-to-br from-blue-400 to-blue-600 hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-white">Overview</h3>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16">
                              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#22c55e"
                                  strokeWidth="2"
                                  strokeDasharray="75, 100"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col text-white items-center justify-center">
                                <span className="text-xs font-medium">{user._count.meetings}</span>
                                <p className="text-xs text-white">
                                {user._count.meetings > 0 ? "Meetings" : "Meeting"}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-white">
                                  Subcribed Channels: <span className="font-medium">{user._count.channels}</span>
                                </span>
                              </div>
                              {completedCourse.length > 0 && <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-white">
                                  Completed Courses: <span className="font-medium">{completedCourse.length}</span>
                                </span>
                              </div>}
                              {completedLesson.length > 0 && <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                <span className="text-white">
                                  Completed Lessons: <span className="font-medium">{completedLesson.length}</span>
                                </span>
                              </div>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                      <UserSettings user={user} />
                  </div>
                </div>
              </div>
            
          
    </div>
  )
}
