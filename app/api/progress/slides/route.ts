import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  try {
    const { slideId} = await req.json()

    const user = await getUser()

    const existProgress = await prisma.completeArena.findFirst({
            where: {
                userId: user?.id,
                courseId: slideId,
                type:"COURSE",
                level:"COMPLETED"
            }
        })

        if(!existProgress){
            await prisma.completeArena.create({
                data: {
                    user: {
                        connect:{
                            id: user?.id
                        }
                    },
                    type:"SLIDE",
                    level:"COMPLETED",
                    finalSlide: {
                        connect:{
                            id: slideId
                        }
                    }
                }
            })
        }

    

        return NextResponse.json({
        status:true
        })
  
    
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
    }

    
}