"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File } from "lucide-react"

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void
}

export function FileDropzone({ onFileAccepted }: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        onFileAccepted(acceptedFiles[0])
      }
    },
    [onFileAccepted],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center w-full h-64 
        border-2 border-dashed rounded-lg 
        transition-colors duration-300 ease-in-out
        ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        {isDragActive ? (
          <Upload className="w-10 h-10 mb-3 text-primary" />
        ) : (
          <File className="w-10 h-10 mb-3 text-gray-400" />
        )}
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 800x400px)</p>
      </div>
    </div>
  )
}

