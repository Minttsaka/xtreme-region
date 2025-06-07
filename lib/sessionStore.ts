"use server"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { getUser } from "./user"

// This interface defines what's stored in the session
export interface SessionPayload {
  userId: string
  name: string
  email: string
  expiresAt: number
  [key: string]: unknown; 
}

// Make sure to set this as an environment variable in both apps
const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

// Function to encrypt session data into a JWT
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

// Function to decrypt the JWT session
export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload as SessionPayload
  } catch (error) {
    console.error(error)
      return null
  }
}

// Function to create a session after login
export async function createSession(userData: { id: string; name: string; email: string }): Promise<string> {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

  const sessionData: SessionPayload = {
    userId: userData.id,
    name: userData.name,
    email: userData.email,
    expiresAt,
  }

  const session = await encrypt(sessionData)

  // FIXED: Properly await cookies() before using it
  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    sameSite: "lax",
    path: "/",
    // Important: set domain to a common parent domain if apps are on subdomains
    // domain: '.yourdomain.com', // This allows sharing between app.yourdomain.com and meet.yourdomain.com
  })

  return session
}
// Function to verify and get the current session
export async function getSession(): Promise<SessionPayload | null> {
  // FIXED: Properly await cookies() before using it
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  const user = await getUser()

  if(!user){
    return null
  }
  if (!session) {
    await createSession({
      id: user.id,
      name: user.name as string,
      email: user.email as string,
    })
  }


  const payload = await decrypt(session)
  if (!payload) return null
  // Check if session is expired
  if (payload.expiresAt < Date.now()) {
    await deleteSession()
    return null
  }

  return payload
}

// Function to delete a session (logout)
export async function deleteSession(): Promise<void> {
  // FIXED: Properly await cookies() before using it
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

