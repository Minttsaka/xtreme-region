import { useState } from 'react'

interface MultimediaUploaderProps {
  onUpload: (type: 'image' | 'video', source: string) => void
}

export default function MultimediaUploader({ onUpload }: MultimediaUploaderProps) {
  const [videoUrl, setVideoUrl] = useState('')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpload('image', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoEmbed = () => {
    if (videoUrl) {
      // Extract video ID from YouTube URL
      const videoId = videoUrl.split('v=')[1]
      const embedUrl = `https://www.youtube.com/embed/${videoId}`
      onUpload('video', embedUrl)
      setVideoUrl('')
    }
  }

  return (
    <div className="multimedia-uploader space-y-2">
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="YouTube URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <button onClick={handleVideoEmbed} className="px-4 py-2 bg-blue-500 text-white rounded">Embed Video</button>
      </div>
    </div>
  )
}

