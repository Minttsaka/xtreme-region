"use client"

import { User } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function useUser() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session?.user) {
      setLoading(false)
      return
    }
    
    // Fetch additional user data if needed
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user")
        if (!response.ok) throw new Error("Failed to fetch user")
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [session, status])

  return {
    user,
    loading: status === "loading" || loading,
    isAuthenticated: !!session
  }
}