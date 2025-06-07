'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ImageIcon, Video, X, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MultimediaUploaderProps {
  onUpload: (type: 'image' | 'video', source: string) => void
}

export function FileUploader({ onUpload }: MultimediaUploaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const file = files[0]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        onUpload('image', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full border-dashed"
            >
              {isOpen ? (
                <X className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Content
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Click to add images, videos, or drag and drop files
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 right-0 mb-2"
          >
            <Card className="border-none bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${dragOver
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-200'
                    }
                  `}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? 'text-purple-500' : 'text-gray-400'}`} />
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop files here, or click to select
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (!file) return

                          const reader = new FileReader()
                          reader.onload = () => {
                            onUpload('image', reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                        input.click()
                      }}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Image
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = prompt('Enter video URL (YouTube, Vimeo, etc.)')
                        if (url) onUpload('video', url)
                      }}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

