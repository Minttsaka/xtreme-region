
import { v4 as uuidv4 } from "uuid"
import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai";

export interface AgendaItemType {
    id: string
    title: string
    duration: number
    description: string | null
    presenter: string | null
    status: "pending" | "progress" | "completed" | "skipped"
    priority: "low" | "medium" | "high"
    notes: string | null
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI });

export async function POST(request: NextRequest) {

  try {

    const { prompt, meetingTitle, meetingDuration, existingItems } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const existingItemsTitles = existingItems.map((item: AgendaItemType) => item.title).join(", ")
    const remainingDuration =
      meetingDuration - existingItems.reduce((acc: number, item: AgendaItemType) => acc + item.duration, 0)

    const systemPrompt = `
      You are an AI assistant that helps create meeting agenda items. 
      Generate agenda items for a meeting titled "${meetingTitle}" with a total duration of ${meetingDuration} minutes.
      
      ${existingItemsTitles ? `The meeting already has these agenda items: ${existingItemsTitles}.` : ""}
      ${remainingDuration > 0 ? `There are ${remainingDuration} minutes remaining for new agenda items.` : "The meeting is already fully scheduled, but the user wants to replace or add more items."}
      
      Based on the user's input: "${prompt}", generate appropriate agenda items.
      
      Return ONLY a valid JSON array of agenda items with the following structure:
      [
        {
          "id": "unique-id-string",
          "title": "Item title",
          "duration": number_of_minutes (reasonable for the meeting context),
          "description": "Brief description or null",
          "presenter": "Name of presenter or null",
          "status": "pending",
          "priority": "low" OR "medium" OR "high",
          "notes": null
        },
        ...
      ]
      
      Ensure:
      1. Each item has a unique ID (use UUID format if possible)
      2. Duration is a reasonable number (in minutes) for the meeting context
      3. Status is always "pending" for new items
      4. Priority is one of: "low", "medium", "high"
      5. The JSON is valid and can be parsed without errors
      6. Do not include any explanations or text outside the JSON array
    `

    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: systemPrompt,
      });
   
    // Extract JSON from the response
    if (!response.text) {
        throw new Error("Response text is undefined");
      }
      
      const jsonMatch = response.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Failed to generate valid JSON");
      }
      

    const jsonString = jsonMatch[0]
    const parsedItems = JSON.parse(jsonString) as AgendaItemType[]

    // Ensure each item has a valid UUID if not already provided
    const itemsWithValidIds = parsedItems.map((item) => ({
      ...item,
      id: item.id || uuidv4(),
    }))

    return NextResponse.json({ items: itemsWithValidIds })
  } catch (error) {
    console.error("Error generating agenda items:", error)
    return NextResponse.json({ error: "Failed to generate agenda items" }, { status: 500 })
  }
}
