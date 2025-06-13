"use client"

// This file contains client-side session management using localStorage
// for cross-domain authentication

interface SessionPayload {
  userId: string
  name: string
  email: string
  expiresAt: number
}

// Simple encryption/decryption for localStorage
// Note: For production, consider using a more robust encryption library
const encryptData = (data: any): string => {
  try {
    return btoa(JSON.stringify(data))
  } catch (error) {
    console.error("Encryption error:", error)
    return ""
  }
}

const decryptData = (encryptedData: string): any => {
  try {
    return JSON.parse(atob(encryptedData))
  } catch (error) {
    console.error("Decryption error:", error)
    return null
  }
}

// Set session in localStorage
export function setClientSession(userData: { id: string; name: string; email: string }): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

  const sessionData: SessionPayload = {
    userId: userData.id,
    name: userData.name,
    email: userData.email,
    expiresAt,
  }

  const session = encryptData(sessionData)
  localStorage.setItem("user_session", session)

  return session
}

// Get session from localStorage
export function getClientSession(): SessionPayload | null {
  if (typeof window === "undefined") return null

  const session = localStorage.getItem("user_session")
  if (!session) return null

  const payload = decryptData(session)
  if (!payload) return null

  // Check if session is expired
  if (payload.expiresAt < Date.now()) {
    localStorage.removeItem("user_session")
    return null
  }

  return payload
}

// Delete session from localStorage
export function deleteClientSession(): void {
  localStorage.removeItem("user_session")
}

// Get session token for API calls
export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("user_session")
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getClientSession() !== null
}

// Custom hook for session management
import { useState, useEffect } from "react"

export function useSession() {
  const [session, setSession] = useState<SessionPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userSession = getClientSession()
    setSession(userSession)
    setLoading(false)
  }, [])

  const login = (userData: { id: string; name: string; email: string }) => {
    setClientSession(userData)
    setSession(getClientSession())
  }

  const logout = () => {
    deleteClientSession()
    setSession(null)
  }

  return {
    session,
    loading,
    login,
    logout,
    isAuthenticated: !!session,
  }
}
