import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

// Define validation schema for the request body
const agendaUpdateSchema = z.object({
  agendaItems: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1, "Item title is required"),
        duration: z.number().min(1, "Duration must be at least 1 minute"),
        description: z.string().optional().nullable(),
        presenter: z.string().optional().nullable(),
        status: z.enum(["progress", "completed", "skipped", "pending"]),
        priority: z.enum(["low", "medium", "high"]),
        notes: z.string().optional().nullable(),
      }),
    )
    .optional(),
})


export async function POST(request: Request) {

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = agendaUpdateSchema.parse(body);

  // Check if meeting exists
    const existingMeeting = await prisma.meeting.findUnique({
        where: { id },
    });

    if (!existingMeeting) {
        return NextResponse.json(
        { success: false, error: "Meeting not found" },
        { status: 404 }
        );
    }

    // If agendaItems is provided and is a non-empty array
    if (Array.isArray(validatedData.agendaItems) && validatedData.agendaItems.length > 0) {
        // Delete existing agenda items
        await prisma.agendaItem.deleteMany({
        where: { meetingId: existingMeeting.id },
        });

        // Recreate agenda items
        for (const item of validatedData.agendaItems) {
          await prisma.agendaItem.create({
              data: {
              title:item.title,
              duration:item.duration,
              description:item.description,
              presenter:item.presenter,
              status:item.status,
              priority:item.priority,
              notes:item.notes,
              meeting:{
                  connect:{
                      id:existingMeeting.id
                  }
              }
            },
        });
        }
    }
    
    // Fetch the updated meeting
    const updatedMeeting = await prisma.meeting.findUnique({
      where: {
        id,
      },

    })

    return NextResponse.json({ success: true, meeting: updatedMeeting })
  } catch (error) {
    console.error("Error updating meeting:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update meeting" }, { status: 500 })
  }
}
