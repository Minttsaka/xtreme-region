"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Calendar, Users, Video } from "lucide-react"

const loadingTips = [
  "Did you know you can set recurring meetings?",
  "You can enable a waiting room for added security.",
  "Don't forget to set your preferred time zone!",
  "You can customize video settings for both host and participants.",
  "Adding a meeting passcode enhances security.",
]

export function LoadingState() {
  const [progress, setProgress] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((oldIndex) => (oldIndex + 1) % loadingTips.length)
    }, 5000)

    return () => {
      clearInterval(tipTimer)
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Clock className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Scheduling Your Meeting</h2>
        <Progress value={progress} className="w-full mb-6" />
        <p className="text-center text-gray-600 mb-6">{loadingTips[tipIndex]}</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <Calendar className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-sm text-gray-600">Date & Time</span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-sm text-gray-600">Attendees</span>
          </div>
          <div className="flex flex-col items-center">
            <Video className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-sm text-gray-600">Settings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

