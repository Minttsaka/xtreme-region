"use client"

import { useEffect, useState } from "react"
import { motion, } from "framer-motion"
import {
  Search,
  Star,
  Clock,
  Zap,
  Play,
  Sparkles,
  Grid,
  Layers,
  Hexagon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChannelCard } from "./ChannelCard"
import { FeaturedLessonsReel } from "./FeaturedLessonsReel"
import { Channel, Lesson } from "@/types/channel"

export function ChannelsPage({
  channels,
  lessons,
}:{
  channels:Channel[],
  lessons:Lesson[]
  }
) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [user, setUser] = useState<null | Record<string, any>>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/public-user") // Replace with your actual API route
        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        console.error("Failed to fetch user:", err)
        setUser(null)
      } 
    }
    fetchUser()
  }, [])


  const filteredChannels = channels.filter((channel) => {
    const matchesSearch =
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab = activeTab === "all" ? true : activeTab === "featured" ? channel.isFeatured: false
    return matchesSearch && matchesTab
  })

  // Get trending lessons (highest views)
  const trendingLessons = [...lessons].sort((a, b) => (b._count.views || 0) - (a._count.views || 0)).slice(0, 8)

  // Get newest lessons
  const newestLessons = [...lessons]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  // Get highest rated lessons
  const highestRatedLessons = [...lessons]
    .filter((lesson) => lesson._count.rating !== null)
    .sort((a, b) => (b._count.rating || 0) - (a._count.rating || 0))
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="flex items-center">
              <div className="relative">
                <Hexagon className="h-10 w-10 text-blue-500 absolute -top-1 -left-1 opacity-20" />
                <Hexagon className="h-10 w-10 text-violet-500 absolute -top-1 -left-1 rotate-30 opacity-30" />
                <Hexagon className="h-10 w-10 text-indigo-500 relative z-10" />
              </div>
              <h1 className="text-4xl font-light tracking-tight text-slate-800 ml-4">
                XTREME-REGION{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-500 relative">
                  Channels
                  <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-violet-500 opacity-70"></div>
                </span>
              </h1>

            </div>
            <p className="mt-2 text-slate-500 max-w-2xl pl-14">
              Explore specialized learning channels from top instructors across the System.
            </p>

            {/* Tabs */}
            <div className="mt-8 flex items-center space-x-1 pl-10 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
                  <Grid className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div
                className={`relative px-4 py-2 cursor-pointer ${
                  activeTab === "all" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Channels
                {activeTab === "all" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500"
                  />
                )}
              </div>
              <div
                className={`relative px-4 py-2 cursor-pointer ${
                  activeTab === "featured" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("featured")}
              >
                Featured
                {activeTab === "featured" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500"
                  />
                )}
              </div>
              <div
                className={`relative px-4 py-2 cursor-pointer ${
                  activeTab === "subscribed" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setActiveTab("subscribed")}
              >
                Subscribed
                {activeTab === "subscribed" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500"
                  />
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-96">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center">
                  <Search className="h-4 w-4 text-blue-500" />
                </div>
                <Input
                  placeholder="Search channels or instructors..."
                  className="pl-10 h-10 bg-white/70 backdrop-blur-sm border-slate-200 focus-visible:ring-blue-500 rounded-xl shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  {filteredChannels.length} results
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Featured Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between mb-6 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Star className="h-6 w-6 text-amber-500" />
            </div>
            <h2 className="text-xl font-medium text-slate-800 flex items-center pl-16">
              Featured Channels
              <div className="ml-3 h-px w-12 bg-gradient-to-r from-amber-500 to-transparent"></div>
            </h2>
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-normal py-1 px-3 rounded-lg shadow-md shadow-amber-500/20">
              <Zap className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChannels
              .filter((channel) => channel.isFeatured)
              .slice(0, 3)
              .map((channel) => (
                <ChannelCard key={channel.id} channel={channel} user={user} />
              ))}
          </div>
        </motion.div>

        {/* Featured Lessons Reels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-6 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Play className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-medium text-slate-800 flex items-center pl-16">
              Featured Lessons
              <div className="ml-3 h-px w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
            </h2>
            
          </div>

          <div className="space-y-10">
            <FeaturedLessonsReel
              title="Trending Now"
              icon={<Zap className="h-4 w-4 text-amber-500" />}
              lessons={trendingLessons}
              gradientFrom="blue-500"
              gradientTo="indigo-500"
            />

            <FeaturedLessonsReel
              title="Newest Lessons"
              icon={<Sparkles className="h-4 w-4 text-blue-500" />}
              lessons={newestLessons}
              gradientFrom="blue-500"
              gradientTo="indigo-500"
            />

            <FeaturedLessonsReel
              title="Highest Rated"
              icon={<Star className="h-4 w-4 text-violet-500" />}
              lessons={highestRatedLessons}
              gradientFrom="blue-500"
              gradientTo="indigo-500"
            />
          </div>
        </motion.div>

        {/* All Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-6 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Layers className="h-6 w-6 text-indigo-500" />
            </div>
            <h2 className="text-xl font-medium text-slate-800 flex items-center pl-16">
              All Channels
              <Badge className="ml-3 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 font-normal py-1 px-3 rounded-lg border border-indigo-200/50">
                {filteredChannels.length}
              </Badge>
              <div className="ml-3 h-px w-12 bg-gradient-to-r from-indigo-500 to-transparent"></div>
            </h2>

            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
              <Clock className="h-4 w-4 text-indigo-500" />
              Recently Updated
            </div>
          </div>

          {filteredChannels.length === 0 ? (
            <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-xl border border-slate-100 shadow-md">
              <div className="text-slate-400 mb-2">No channels found</div>
              <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChannels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} user={user} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
