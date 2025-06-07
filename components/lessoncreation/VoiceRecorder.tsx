"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { transcribeAudio } from "@/app/actions/actions"

type VoiceRecorderProps = {
  setIsAITyping: React.Dispatch<React.SetStateAction<boolean>>
  setNewMessage: React.Dispatch<React.SetStateAction<string>>
  inputRef: React.MutableRefObject<HTMLDivElement | null>
}

export function VoiceRecorder({ setIsAITyping, setNewMessage, inputRef }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
       

        // Stop all tracks from the stream
        stream.getTracks().forEach((track) => track.stop())

        // Now that we have the audioBlob, we can transcribe
        await handleTranscribeWithBlob(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setIsAITyping(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {

      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsProcessing(true) // Set processing state immediately for better UX
    }
  }

  const handleTranscribeWithBlob = async (blob: Blob) => {
  
    try {
      // Create a File object from the Blob
      const audioFile = new File([blob], "audio.wav", { type: "audio/wav" })

      // Create FormData and append the file
      const formData = new FormData()
      formData.append("audio", audioFile)

      // Call the server action
      const result = await transcribeAudio(formData)

 
      if (result.error) {
        console.error("Transcription error:", result.error)
      } else if (result.transcript) {
        const transcribedText = result.transcript
        setNewMessage(transcribedText)
        if (inputRef.current) {
          inputRef.current.textContent = transcribedText
        }
      }
    } catch (error) {
      console.error("Error transcribing audio:", error)
    } finally {
      setIsProcessing(false)
      setIsAITyping(false)
    }
  }

  return (
    <>
      {isRecording || isProcessing ? (
        <div className="absolute -top-10 right-3">
          <Button
            variant="destructive"
            className="h-8 rounded-full bg-red-600 hover:bg-red-700 text-white border border-white/10 shadow-lg shadow-red-500/20"
            onClick={stopRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                <span className="text-xs">Processing...</span>
              </>
            ) : (
              <>
                <MicOff className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Stop Recording</span>
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="absolute -top-10 right-3">
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border border-white/10 shadow-lg shadow-purple-500/20"
            onClick={() => {
              setIsAITyping(true)
              startRecording()
            }}
          >
            <Mic className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">AI Recorder</span>
          </Button>
        </div>
      )}
    </>
  )
}

