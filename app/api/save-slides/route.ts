import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lessonId, slides } = body

    // Validate input
    if (!lessonId) {
      return NextResponse.json({ success: false, error: "Lesson ID is required" }, { status: 400 })
    }

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json({ success: false, error: "No valid slides to save" }, { status: 400 })
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 })
    }

    const result = await prisma.$transaction(async (tx) => {
      // Delete existing slides for this lesson
      await tx.slide.deleteMany({
        where: { lessonId },
      })

      const createdSlides = []

      // Create new slides
      for (const slideData of slides) {
        // Validate slide data
        if (!slideData.title) {
          console.warn("Skipping slide without title:", JSON.stringify({ id: slideData.id }))
          continue
        }

        const createdSlide = await tx.slide.create({
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
            
            if (!noteData.content) {
              console.warn("Skipping note without content for slide:", createdSlide.id)
              continue
            }

            await tx.note.create({
              data: {
                content: noteData.content,
                type: noteData.type || "text",
                source: noteData.source || null,
                slideId: createdSlide.id,
                order: i,
              },
            })
          }
        }

        // Create comments for this slide
        if (slideData.comments && Array.isArray(slideData.comments) && slideData.comments.length > 0) {
          for (const commentData of slideData.comments) {
            if (!commentData.content || !commentData.sender?.id) {
              console.warn("Skipping invalid comment for slide:", createdSlide.id)
              continue
            }

            try {
              // Verify sender exists
              const sender = await tx.user.findUnique({
                where: { id: commentData.sender.id },
              })

              if (!sender) {
                console.warn("Sender not found, skipping comment:", commentData.sender.id)
                continue
              }

              const createdComment = await tx.slideComment.create({
                data: {
                  text: commentData.content,
                  sender:{
                    connect:{
                      id: sender.id
                    }
                  },
                  slide:{
                    connect:{
                      id: createdSlide.id
                    }
                  },
                },
              })

              // Create reactions for this comment
              if (commentData.reactions && Array.isArray(commentData.reactions) && commentData.reactions.length > 0) {
                for (const reactionData of commentData.reactions) {
                  if (!reactionData.emoji || !reactionData.user?.id) {
                    console.warn("Skipping invalid reaction for comment:", createdComment.id)
                    continue
                  }

                  try {
                    // Verify reaction user exists
                    const reactionUser = await tx.user.findUnique({
                      where: { id: reactionData.user.id },
                    })

                    if (!reactionUser) {
                      console.warn("Reaction user not found, skipping:", reactionData.user.id)
                      continue
                    }

                    await tx.reaction.create({
                      data: {
                        emoji: reactionData.emoji,
                        user: reactionUser.id,
                        commentId: createdComment.id,
                      },
                    })
                  } catch (reactionError) {
                    console.warn("Failed to create reaction:", 
                      reactionError instanceof Error ? reactionError.message : String(reactionError))
                    // Continue processing other reactions
                  }
                }
              }
            } catch (commentError) {
              console.warn("Failed to create comment:", 
                commentError instanceof Error ? commentError.message : String(commentError))
              // Continue processing other comments
            }
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
    // Safe error logging with structured data
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
      { status: 500 },
    )
  }
}