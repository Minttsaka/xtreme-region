"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import TipsModal from "./TipsModal"
import { Prisma } from "@prisma/client"
import ChannelAnalyticsDashboard from "../analytics/ChannelAnalyticsDashboard"
import { CustomButton } from "../ui/CustomButton"
import { createChannel, getUserChannel } from "@/app/actions/channel"
import ChannelForm from "./ChannelForm"
import { toast } from "sonner"

type Channel = Prisma.ChannelGetPayload<{
  include:{
    courses:{
      include:{
        lessons:true
      }
    }
  }
}> 

type User = Prisma.UserGetPayload<{
  include:{
    channels:true
  }
}>


const ChannelManagement: React.FC<{ user: User }> = ({ user }) => {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [showTips, setShowTips] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChannel() {
      try {
        setLoading(true)
        const channelData = await getUserChannel()

        if (channelData) {
          setChannel(channelData)
          setShowTips(false)

          // Fetch channel stats
          } else {
          setShowTips(user.channels.length === 0)
        }
      } catch (error) {
        console.error("Error fetching channel:", error)
        toast("Failed to load channel data")
      } finally {
        setLoading(false)
      }
    }

    fetchChannel()
  }, [user, toast])

  const handClose = () =>{

    setShowTips(false)

  }

  const handleCreateDefaultChannel = async () => {
    try {
      setLoading(true)
      const newChannel = await createChannel(
        `${user.name}'s Channel`,
        "The mega channel",
        user.image
      )
      setChannel(newChannel as Channel)

      toast( "Your channel has been created!")

    } catch (error) {
      console.error("Error creating channel:", error)

      toast( "Failed to create channel")
      
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 container mx-auto  flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 container mx-auto ">
      {user.channels.length === 0 && <TipsModal isOpen={showTips} onClose={handClose}  />}
      {channel && <ChannelForm />}
      {channel && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <ChannelAnalyticsDashboard channelId={channel.id} />
        </motion.div> 
      )}
      
      {!channel && !showTips && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CustomButton
            onClick={handleCreateDefaultChannel}
            className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
          >
            Create Your Channel
          </CustomButton>
        </motion.div>
      )}
    </div>
  )
}

export default ChannelManagement
