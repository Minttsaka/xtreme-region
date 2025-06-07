import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        slides: {
          include: {
            notes: { orderBy: { order: 'asc' } },
            SlideComment: {
              include: {
                sender: true,
                reactions: true
              }
            }
          },
        }
      }
    })
        
    const formattedSlides = lesson?.slides.map(slide => ({
      id: slide.id,
      title: slide.title as string,
      comments: slide.SlideComment.map(comment => ({
        id: comment.id,
        text: comment.text,
        sender: comment.sender.name,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        reactions: comment.reactions.map(reaction => ({
          id: reaction.id,
          emoji: reaction.emoji,
          user: reaction.user
        })),
      })),
      notes: slide.notes.map(note => ({
        id: note.id,
        content: note.content,
        type: note.type as 'text' | 'image' | 'video',
        source: note.source || undefined
      }))
    }))

    return Response.json(formattedSlides || [])
  } catch (error) {
    console.error("Error fetching slides:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Failed to fetch slides" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lessonId, slides } = body

    // Validate request body
    if (!body) {
      return NextResponse.json({ success: false, error: "Missing request body" }, { status: 400 })
    }

    if (!lessonId) {
      return NextResponse.json({ success: false, error: "Lesson ID is required" }, { status: 400 })
    }

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ success: false, error: "No valid slides to save" }, { status: 400 })
    }

    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 })
    }

    // Process slides in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing final slides for this lesson
      await tx.finalSlide.deleteMany({
        where: { lessonId: lesson.id },
      })

      const createdSlides = []

      for (const slideData of slides) {
        // Skip slides without proper title
        if (!slideData.title || slideData.title === "Untitled") {
          console.warn("Skipping slide without title:", slideData.id || "unknown")
          continue
        }

        // Create the slide
        const createdSlide = await tx.finalSlide.create({
          data: {
            title: slideData.title,
            lessonId: lesson.id,
          },
        })

        createdSlides.push(createdSlide)

        // Create notes for this slide
        if (slideData.notes && Array.isArray(slideData.notes) && slideData.notes.length > 0) {
          for (let i = 0; i < slideData.notes.length; i++) {
            const noteData = slideData.notes[i]
            
            // Skip notes without content
            if (!noteData.content || noteData.content === "New Slide") {
              console.warn("Skipping note without content for slide:", createdSlide.id)
              continue
            }

            await tx.note.create({
              data: {
                content: noteData.content,
                type: noteData.type || "text",
                source: noteData.source || null,
                finalSlideId: createdSlide.id,
                order: i, // Set order based on array index
              },
            })
          }
        }
      }

      return createdSlides
    },{
  timeout: 15000, // 10 second timeout
    })

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${result.length} slides`,
      slidesCount: result.length,
    })

  } catch (error) {
    // Safe error logging
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error("Failed to save slides:", {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}