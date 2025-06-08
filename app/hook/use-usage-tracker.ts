"use client"

import { useState, useEffect, useCallback } from "react"

const USAGE_KEY = "elevenlabs_usage"
const MAX_USAGE_SECONDS = 15
const ADMIN_EMAIL = "ebs21-mtsaka@mubas.ac.mw"

interface UsageData {
  totalUsed: number
  lastUsed: number
  deviceId: string
}

export function useUsageTracker() {
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [currentSessionTime, setCurrentSessionTime] = useState(0)
  const [isTracking, setIsTracking] = useState(false)
  const [hasFullAccess, setHasFullAccess] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/public-user")
      const data = await res.json()
      setUserEmail(data.user.email)
    } catch (err) {
      console.error("Failed to fetch user:", err)
    } 
  } 

  useEffect(() => {
    fetchUser()
  }, [])

  // Check if user has full access
  useEffect(() => {
    setHasFullAccess(userEmail === ADMIN_EMAIL)
  }, [userEmail])

  // Generate or get device ID
  const getDeviceId = useCallback(() => {
    let deviceId = localStorage.getItem("device_id")
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("device_id", deviceId)
    }
    return deviceId
  }, [])

  // Load usage data
  useEffect(() => {
    const deviceId = getDeviceId()
    const stored = localStorage.getItem(USAGE_KEY)

    if (stored) {
      try {
        const data = JSON.parse(stored) as UsageData
        if (data.deviceId === deviceId) {
          setUsageData(data)
        } else {
          // Different device, create new usage data
          const newData: UsageData = {
            totalUsed: 0,
            lastUsed: Date.now(),
            deviceId,
          }
          setUsageData(newData)
          localStorage.setItem(USAGE_KEY, JSON.stringify(newData))
        }
      } catch (error) {
        console.error("Error parsing usage data:", error)
        const newData: UsageData = {
          totalUsed: 0,
          lastUsed: Date.now(),
          deviceId,
        }
        setUsageData(newData)
        localStorage.setItem(USAGE_KEY, JSON.stringify(newData))
      }
    } else {
      const newData: UsageData = {
        totalUsed: 0,
        lastUsed: Date.now(),
        deviceId,
      }
      setUsageData(newData)
      localStorage.setItem(USAGE_KEY, JSON.stringify(newData))
    }
  }, [getDeviceId])

  // Timer for tracking current session
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking && !hasFullAccess) {
      interval = setInterval(() => {
        setCurrentSessionTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isTracking, hasFullAccess])

  const startTracking = useCallback(() => {
    if (hasFullAccess) {
      setIsTracking(true)
      return true
    }

    if (!usageData) return false

    const remainingTime = MAX_USAGE_SECONDS - usageData.totalUsed
    if (remainingTime <= 0) {
      return false // No time left
    }

    setIsTracking(true)
    setCurrentSessionTime(0)
    return true
  }, [usageData, hasFullAccess])

  const stopTracking = useCallback(() => {
    if (!isTracking || hasFullAccess) {
      setIsTracking(false)
      setCurrentSessionTime(0)
      return
    }

    if (usageData && currentSessionTime > 0) {
      const newUsageData: UsageData = {
        ...usageData,
        totalUsed: usageData.totalUsed + currentSessionTime,
        lastUsed: Date.now(),
      }

      setUsageData(newUsageData)
      localStorage.setItem(USAGE_KEY, JSON.stringify(newUsageData))
    }

    setIsTracking(false)
    setCurrentSessionTime(0)
  }, [usageData, currentSessionTime, isTracking, hasFullAccess])

  const getRemainingTime = useCallback(() => {
    if (hasFullAccess) return Number.POSITIVE_INFINITY
    if (!usageData) return 0
    return Math.max(0, MAX_USAGE_SECONDS - usageData.totalUsed - currentSessionTime)
  }, [usageData, currentSessionTime, hasFullAccess])

  const canStartConversation = useCallback(() => {
    if (hasFullAccess) return true
    return getRemainingTime() > 0
  }, [getRemainingTime, hasFullAccess])

  const resetUsage = useCallback(() => {
    if (hasFullAccess && usageData) {
      const resetData: UsageData = {
        ...usageData,
        totalUsed: 0,
        lastUsed: Date.now(),
      }
      setUsageData(resetData)
      localStorage.setItem(USAGE_KEY, JSON.stringify(resetData))
    }
  }, [usageData, hasFullAccess])

  return {
    usageData,
    currentSessionTime,
    isTracking,
    hasFullAccess,
    startTracking,
    stopTracking,
    getRemainingTime,
    canStartConversation,
    resetUsage,
    maxUsageSeconds: MAX_USAGE_SECONDS,
  }
}
