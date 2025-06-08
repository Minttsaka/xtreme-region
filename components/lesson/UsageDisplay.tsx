"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, Crown } from "lucide-react"

interface UsageDisplayProps {
  currentTime: number
  totalUsed: number
  maxTime: number
  isTracking: boolean
  hasFullAccess: boolean
}

export function UsageDisplay({ currentTime, totalUsed, maxTime, isTracking, hasFullAccess }: UsageDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const totalTimeUsed = totalUsed + currentTime
  const remainingTime = Math.max(0, maxTime - totalTimeUsed)
  const progressPercentage = hasFullAccess ? 0 : (totalTimeUsed / maxTime) * 100

  if (hasFullAccess) {
    return (
      <Crown className="w-4 h-4 text-yellow-500" />
    )
  }

  return (
    <div className={`${progressPercentage >= 100 ? "border-red-200 bg-red-50" : ""}`}>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Usage Time</span>
            {isTracking && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
          </div>
          <span className={`font-mono ${remainingTime <= 5 ? "text-red-600 font-bold" : ""}`}>
            {formatTime(remainingTime)} left
          </span>
        </div>
        {remainingTime <= 5 && remainingTime > 0 && (
          <div className="text-xs text-red-600 font-medium text-center">⚠️ Less than 5 seconds remaining!</div>
        )}
      </div>
    </div>
  )
}
