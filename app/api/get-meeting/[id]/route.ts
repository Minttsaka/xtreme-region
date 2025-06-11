import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request:Request) {


  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  const origin = request.headers.get('origin')

  
    try {
      const meeting = await prisma.meeting.findUnique({
  
        where: {
          id
        },
       
        include: {
          host: {
            select:{
              id:true,
              name:true,
              email:true,
            }
          },
         files:true,
         agendaItems:true,
         lesson:{
          include: {
          finalSlide: {
            include: {
              notes: true,
            }
          },
         
          resources: {
            include: {
              resource: true
            }
          }
        }
         }
        } 
    })

    console.log("meet",meeting)
  
      return new NextResponse(JSON.stringify(meeting),{
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