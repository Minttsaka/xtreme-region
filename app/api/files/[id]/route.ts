import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"


export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') || '*'
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400' // 24 hours
    }
  })
}

// Handle POST requests
export async function POST(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const origin = request.headers.get('origin') || '*'

  try {
    // Parse the request body
    const { files, uploader } = await request.json()

    // Check if meeting exists
    const meeting = await prisma.meeting.findFirst({
      where: {
        id
      },
    })

    if (!meeting) {
      return new NextResponse(
        JSON.stringify({
          status: 404,
          message: "meeting not found"
        }),
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Create file records
    for (const file of files) {
      await prisma.files.create({
        data: {
          uploder: uploader,
          name: file.name,
          type: file.type,
          url: file.url,
          meeting: {
            connect: {
              id
            }
          }
        }
      })
    }

     // Return success response with proper CORS headers
    return new NextResponse(
      JSON.stringify({ success: true, meeting }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Content-Type": "application/json"
        }
      }
    )
  } catch (error) {
    console.error("Error uploading files:", error)
    
    // Return error response with proper CORS headers
    return new NextResponse(
      JSON.stringify({ error: "Failed to upload files" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Content-Type": "application/json"
        }
      }
    )
  }
}

export async function GET(request:Request) {


  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  const origin = request.headers.get('origin')
  
    try {
      const files = await prisma.files.findMany({
  
        where: {
          meetingId:id
        }
        
    })

      return new NextResponse(JSON.stringify(files),{
        headers :{
          "Access-Control-Allow-Origin": origin || '*',
          "Content-Type":'application/json'
        }
      })
    } catch (error) {
      console.error("Error fetching meetings:", error)
      return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 })
    }
  }