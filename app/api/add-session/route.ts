import { NextResponse } from 'next/server'
import { getUser } from '@/lib/user'
import { createSession, getSession } from '@/lib/sessionStore'


export async function GET(
) {
  try {

    let temp = null
    const session = await getSession()

    temp = session
    const user = await getUser()
    
      if(!user){
        return NextResponse.json({
          status : false,
          message: "Error"
        })
      }
      if (!session) {
        temp = await createSession({
          id: user.id,
          name: user.name as string,
          email: user.email as string,
        })
      }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Join classroom error:', error)
    return NextResponse.json(
      { error: 'Failed to join classroom' },
      { status: 500 }
    )
  }
}




