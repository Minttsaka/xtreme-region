"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, LinkIcon, ImageIcon, Video, X, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { uploadFileTos3 } from '@/lib/aws'

interface MediaUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onMediaSelect: (url: string, type: 'image' | 'video') => void
  type: 'image' | 'video'
}

export function MediaUploadModal({ isOpen, onClose, onMediaSelect, type }: MediaUploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload')
  const [linkUrl, setLinkUrl] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type === 'image' 
      ? { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }
      : { 'video/*': ['.mp4', '.webm', '.ogg'] },
    maxFiles: 1
  })

  const handleSubmit = async () => {
    if (activeTab === 'link') {
      onMediaSelect(linkUrl, type)
      onClose()
      return
    }

    if (uploadedFile) {
      setIsUploading(true)
      const data = await uploadFileTos3(uploadedFile);
      onMediaSelect(data.url as string, type)
      setIsUploading(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-none bg-white/80 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'image' ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            {`Upload ${type === 'image' ? 'Image' : 'Video'}`}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'link')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-lg p-8 transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200'}
              `}
            >
              <input {...getInputProps()} />
              
              <AnimatePresence mode="wait">
                {!uploadedFile ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Drag & drop your {type} here, or click to select
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {type === 'image' ? 'PNG, JPG, GIF up to 10MB' : 'MP4, WEBM, OGG up to 100MB'}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    {type === 'image' ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    ) : (
                      <video
                        src={previewUrl}
                        className="w-full h-48 object-cover rounded-md"
                        controls
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadedFile(null)
                        setPreviewUrl('')
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  type="url"
                  placeholder={`Enter ${type} URL...`}
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              (activeTab === 'upload' && !uploadedFile) ||
              (activeTab === 'link' && !linkUrl) ||
              isUploading
            }
            className="min-w-[100px]"
          >
            {isUploading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Insert
              </motion.div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

