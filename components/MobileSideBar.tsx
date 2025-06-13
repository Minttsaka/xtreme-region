"use client"

import React, { useEffect } from 'react'
import { useState } from "react"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  School,
  StickyNote,
  Presentation,
  Plus,
  Star,
  LogOut,
  Zap,
  ChevronDown,
  User as Us,
  Dot,
  GitGraph,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import Logo from "./Logo"
import { Prisma, User } from "@prisma/client"
import { signOut } from 'next-auth/react'

type Channel = Prisma.SubscriptionGetPayload<{
  include:{
        channel:{
        include: {
          _count: {
            select: {
              subscriptions: true,
            },
          }
        }
        
      },
      }
}>

type Recommended = Prisma.ChannelGetPayload<{
    include: {
        _count: {
            select: {
            subscriptions: true,
            },
        }
        
        },
}>

type Subscription = Prisma.SubscriptionGetPayload<{
  include:{
        course:{
          include:{
            enrollment: true
          }
      }
    }
}>

const menuItems = [
  { icon: Home, label: "Dashboard", link: "/i/dashboard", color: "bg-pink-400" },
  { icon: Presentation, label: "Meetings", link: "/i/meeting", color: "bg-green-400" },
  { icon: School, label: "Institution", link: "/i/institution", color: "bg-purple-400" },
  { icon: GitGraph, label: "Survey", link: "/i/survey", color: "bg-indigo-400" },
  { icon: StickyNote, label: "Channel", link: "/i/channel", color: "bg-blue-400" },
]

export default function MobileSideBar(
    {
    subscribedChannels,
    subscriptions,
    recommendedChannels, 
    userData,
  }:{
  subscribedChannels:Channel[], 
  recommendedChannels:Recommended[],
  subscriptions: Subscription[] | undefined,
   userData:User
  }
) {

  const [activeItem, setActiveItem] = useState("Dashboard")
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAllChannels, setShowAllChannels] = useState(false)

  useEffect(()=>{
    setIsExpanded(true)
  },[])

  const displayedChannels = showAllChannels ? subscribedChannels : subscribedChannels.slice(0, 3)

  return (
    <div className="md:hidden relative">
        <Sheet>
        <SheetTrigger className='fixed left-1 top-1' asChild>
            <Button variant="ghost" size="sm" className="text-gray-600">
                <Menu className="h-5 w-5" />
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-black">
            <SheetTitle className='mt-1 ml-2 text-white text-xs'>
                MENU
            </SheetTitle>
            <SheetClose className='absolute top-1 right-1'>
                <X className='text-white' />
            </SheetClose>
            <TooltipProvider>
            <motion.div
                className={cn(
                "w-full  border-purple-200 h-screen overflow-hidden flex flex-col py-4 transition-all duration-300",
                )}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-center mb-6">
                <motion.div
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Logo />
                </motion.div>
                </div>

                <ScrollArea className="flex-1 w-full overflow-y-auto h-full px-2">
                <div className="flex flex-col space-y-4">
                    {/* Main Menu Items */}
                    <div className="flex flex-col items-center text-white space-y-2">
                    {menuItems.map((item) => (
                        <Tooltip key={item.label} delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Link href={item.link} className="w-full">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full flex justify-center"
                            >
                                <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "relative flex items-center justify-start px-2 py-1.5 w-10 h-10 rounded-xl transition-all duration-300",
                                    isExpanded && "w-full justify-start",
                                    activeItem === item.label
                                    ? `${item.color} text-white`
                                    : "hover:text-gray-900 hover:bg-white/10",
                                )}
                                onClick={() => setActiveItem(item.label)}
                                >
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                <AnimatePresence>
                                    {isExpanded && (
                                    <motion.span
                                        className="ml-3 text-sm font-medium"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                    )}
                                </AnimatePresence>
                                {activeItem === item.label && (
                                    <motion.div
                                    className="absolute right-2 w-2 h-2 rounded-full bg-white"
                                    layoutId="activeIndicator"
                                    />
                                )}
                                </Button>
                            </motion.div>
                            </Link>
                        </TooltipTrigger>
                        {!isExpanded && (
                            <TooltipContent side="right" sideOffset={10}>
                            <p className="text-xs font-medium">{item.label}</p>
                            </TooltipContent>
                        )}
                        </Tooltip>
                    ))}
                    </div>

                    {/* courses Section */}
                {(subscriptions?.length ?? 0) > 0
                && <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-700 pt-4 mt-4"
                        >
                        <div className="flex items-center justify-between mb-3 px-2">
                            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Courses</h3>
                        
                        </div>

                        <div className="space-y-1">
                            {subscriptions?.map((sub) => (
                            <Link
                                key={sub.id}
                                target="__blank"
                                href={`/channels/course/${sub.course?.id}`}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                            >
                                <div className="relative">
                                <img
                                    src={sub.course?.thumbnail || "https://img.freepik.com/free-vector/youtube-player-icon-with-flat-design_23-2147837753.jpg"}
                                    alt={sub.course?.thumbnail as string}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />

                                </div>
                                <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                    <p className="text-xs font-medium text-white truncate">{sub.course?.title}</p>
                                    {sub.course?.isFeatured && <Star className="w-2.5 h-2.5 text-yellow-500 flex-shrink-0" />}
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-gray-400">
                                    <span>{sub.course?.enrollment.length}</span> <Dot className="text-green-500" /> Enrolled
                                
                                </div>
                                </div>
                            </Link>
                            ))}

                            {subscribedChannels.length > 3 && (
                            <button
                                onClick={() => setShowAllChannels(!showAllChannels)}
                                className="flex items-center space-x-2 w-full p-2 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                            >
                                <ChevronDown
                                className={`w-3 h-3 transition-transform duration-200 ${showAllChannels ? "rotate-180" : ""}`}
                                />
                                <span>{showAllChannels ? "Show Less" : `Show ${subscribedChannels.length - 3} More`}</span>
                            </button>
                            )}
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>}

                    {/* Subscriptions Section */}
                    <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-700 pt-4 mt-4"
                        >
                        <div className="flex items-center justify-between mb-3 px-2">
                            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Subscriptions</h3>
                            <Link target="__blank" href="/channels">
                            <Tooltip delayDuration={300}>
                                <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-gray-400 hover:text-white">
                            <Plus className="w-3 h-3" />
                            </Button>
                            </TooltipTrigger>
                                <TooltipContent side="left" sideOffset={10}>
                                <p className="text-xs font-medium">Explore Channels</p>
                                </TooltipContent>
                            </Tooltip>
                            </Link>
                        </div>

                        <div className="space-y-1">
                            {displayedChannels.map((channel) => (
                            <Link
                                key={channel.channel.id}
                                target="__blank"
                                href={`/channels/${channel.channel.id}`}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                            >
                                <div className="relative">
                                <img
                                    src={channel.channel.thumbnail || "https://img.freepik.com/free-vector/youtube-player-icon-with-flat-design_23-2147837753.jpg"}
                                    alt={channel.channel.thumbnail as string}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />

                                </div>
                                <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1">
                                    <p className="text-xs font-medium text-white truncate">{channel.channel.name}</p>
                                    {channel.channel.isFeatured && <Star className="w-2.5 h-2.5 text-yellow-500 flex-shrink-0" />}
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-gray-400">
                                    <span>{channel.channel._count.subscriptions}</span><Dot className="text-green-500" /> Subscribed
                                
                                </div>
                                </div>
                            </Link>
                            ))}

                            {subscribedChannels.length > 3 && (
                            <button
                                onClick={() => setShowAllChannels(!showAllChannels)}
                                className="flex items-center space-x-2 w-full p-2 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                            >
                                <ChevronDown
                                className={`w-3 h-3 transition-transform duration-200 ${showAllChannels ? "rotate-180" : ""}`}
                                />
                                <span>{showAllChannels ? "Show Less" : `Show ${subscribedChannels.length - 3} More`}</span>
                            </button>
                            )}
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    {/* Recommended Section */}
                    <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="border-t border-gray-700 pt-4"
                        >
                        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3 px-2">Recommended</h3>
                        <div className="space-y-1">
                            {recommendedChannels.map((channel) => (
                            <Link
                                key={channel.id}
                                href={`/channels/${channel.id}`}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                            >
                                <img
                                src={channel.thumbnail || "https://img.freepik.com/free-vector/youtube-player-icon-with-flat-design_23-2147837753.jpg"}
                                alt={channel.name}
                                width={20}
                                height={20}
                                className="rounded-full"
                                />
                                <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white truncate">{channel.name}</p>
                                <p className="text-xs text-gray-400">
                                    {channel._count.subscriptions} • {channel.isFeatured}
                                </p>
                                </div>
                                <Button
                                variant="outline"
                                size="sm"
                                className="text-xs px-2 py-0.5 h-6 opacity-0 group-hover:opacity-100 transition-opacity border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
                                >
                                Explore
                                </Button>
                            </Link>
                            ))}
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                </ScrollArea>

                {/* User Profile Footer */}
                <AnimatePresence>
                {isExpanded && (
                    <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700 pt-4 px-2"
                    >
                    <div className="flex items-center space-x-2 mb-2">
                        <img
                        src={userData.image || "https://img.freepik.com/free-vector/youtube-player-icon-with-flat-design_23-2147837753.jpg"}
                        alt={userData.name as string}
                        width={28}
                        height={28}
                        className="rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{userData.name}</p>
                        <div className="flex items-center space-x-1">
                            <Badge variant="outline" className="text-xs px-1 py-0 h-4 border-gray-600 text-gray-300">
                            {userData.career}
                            </Badge>
                            <Zap className="w-2.5 h-2.5 text-yellow-500" />
                        </div>
                        </div>
                    </div>
                    <div className="flex space-x-1">
                        <Link href="/i/profile" className="">
                        <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8 text-gray-400 hover:text-white hover:bg-white/10"
                        >
                        <Us className="w-3 h-3" />
                        </Button>
                        </Link>
                        
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={()=>signOut()}
                        className="flex-1 h-8 text-gray-400 hover:text-white hover:bg-white/10"
                        >
                        <LogOut className="w-3 h-3" />
                        </Button>
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </motion.div>
            </TooltipProvider>
        </SheetContent>
    </Sheet>
</div>
)
}
