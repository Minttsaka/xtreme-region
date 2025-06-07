"use client"

import { motion } from "framer-motion"
import { Users,Heart,} from "lucide-react"
import type { Channel } from "@/types/channel"
import Link from "next/link"
import { CustomButton } from "../ui/CustomButton"
import { Card } from "@/components/ui/BestCardDemo"

interface ChannelCardProps {
  channel: Channel
  user: null | Record<string, any>
}

export function ChannelCard({ channel, user }: ChannelCardProps) {



  return (
   <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${channel.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
          <div className="hidden">{user?.bio}</div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 h-64 flex flex-col justify-between text-white">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            {channel.isFeatured && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Middle Section */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
              {channel.name}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2 mb-4">{channel.description}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-white/70">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{channel._count.subscriptions} subscribers</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{channel._count.likes} likes</span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            <Link href={`/channels/${channel.id}`} className="flex-1">
              <CustomButton
                className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 group-hover:border-transparent"
                variant="outline"
              >
                Explore Channel
              </CustomButton>
            </Link>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>
    </motion.div>
  )
}
