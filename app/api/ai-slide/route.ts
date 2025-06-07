
import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI });

export async function POST(request: NextRequest) {

  try {

    const { 
        prompt,
    } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
    // Extract JSON from the response
    if (!response.text) {
        throw new Error("Response text is undefined");
      }

 
    return NextResponse.json(response.text)
  } catch (error) {
    console.error("Error generating agenda items:", error)
    return NextResponse.json({ error: "Failed to generate agenda items" }, { status: 500 })
  }
}
