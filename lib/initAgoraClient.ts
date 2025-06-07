

import AgoraRTM, { RTMClient } from "agora-rtm-sdk"
import { User } from "@prisma/client"

const { RTM } = AgoraRTM


// Replace with your actual Agora App ID
const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || ""

export const getOrCreateUserId = (user: User): string => {

  const refinedId = `${user?.id}-${user?.name}`

return refinedId
};


export async function getAgoraToken(userId: string) {
  try {
    const response = await fetch('/api/agora-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data.token
  } catch (error) {
    console.error('Error getting Agora token:', error)
    throw error
  }
}


export async function initializeAgoraRTM( meetingId: string, user:User) {
  try {
    const userId = getOrCreateUserId(user)

    // Create an RTM instance with the new API
    const rtm = new RTM(AGORA_APP_ID, userId)

    // Get token (in production, fetch from your server)
    const token = await getAgoraToken(userId)

    // Login to RTM
    try {
      await rtm.login({ token })
   
    } catch (status) {
      console.error("Failed to login to RTM:", status)
      throw status
    }

    // Subscribe to the channel
    try {
      await rtm.subscribe(meetingId)
       } catch (status) {
      console.error("Failed to subscribe to channel:", status)
      throw status
    }

    return { rtm, channelName: meetingId }
  } catch (error) {
    console.error("Failed to initialize Agora RTM:", error)
    throw error
  }
}

// Helper function to publish a message to a channel
export async function publishMessage(rtm: RTMClient | undefined, channelName: string, message: any) {
  try {
    // Convert message object to string
    const messageString = JSON.stringify(message)

    // Publish the message
    await rtm?.publish(channelName, messageString)
   
    return true
  } catch (status) {
    console.error("Failed to publish message:", status)
    throw status
  }
}

