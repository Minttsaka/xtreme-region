// Helper function to combine date and time
export const combineDateAndTime = (startDate: Date, startTime: Date): Date => {
  const combined = new Date(startDate)
  combined.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds())
  return combined
}

// Calculate meeting progress percentage
export const getMeetingProgress = (startTime: Date, startDate: Date, duration: number) => {
  const now = new Date()
  const actualStartTime = combineDateAndTime(startDate, startTime)
  const endTime = new Date(actualStartTime.getTime() + duration * 60000)

  if (now < actualStartTime) return 0
  if (now > endTime) return 100

  const totalDuration = duration * 60000
  const elapsed = now.getTime() - actualStartTime.getTime()
  return Math.min(Math.round((elapsed / totalDuration) * 100), 100)
}

// Get time remaining or until start
export const getTimeIndicator = (startTime: Date, startDate: Date, duration: number) => {
  const now = new Date()
  const actualStartTime = combineDateAndTime(startDate, startTime)
  const endTime = new Date(actualStartTime.getTime() + duration * 60000)

  if (now < actualStartTime) {
    const diffMs = actualStartTime.getTime() - now.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 60) {
      return `Starts in ${diffMins} min`
    } else {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return `Starts in ${hours}h ${mins}m`
    }
  } else if (now <= endTime) {
    const diffMs = endTime.getTime() - now.getTime()
    const diffMins = Math.round(diffMs / 60000)
    return `${diffMins} min remaining`
  } else {
    return "Meeting ended"
  }
}

export const getStatusVariant = (startTime: Date, startDate: Date, duration: number) => {
  const now = new Date()
  const actualStartTime = combineDateAndTime(startDate, startTime)
  const endTime = new Date(actualStartTime.getTime() + duration * 60000)

  if (now < actualStartTime) {
    return "secondary"
  } else if (now >= actualStartTime && now <= endTime) {
    return "primary"
  } else {
    return "destructive"
  }
}

export const getButtonLabel = (startTime: Date, startDate: Date, duration: number) => {
  const now = new Date()
  const actualStartTime = combineDateAndTime(startDate, startTime)
  const endTime = new Date(actualStartTime.getTime() + duration * 60000)

  if (now < actualStartTime) {
    return "View"
  } else if (now >= actualStartTime && now <= endTime) {
    return "Join Meeting"
  } else {
    return "View Recording"
  }
}

export const isButtonDisabled = (startTime: Date, startDate: Date) => {
  const now = new Date()
  const actualStartTime = combineDateAndTime(startDate, startTime)

  return now < actualStartTime
}

// Get file extension and type functions
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || ""
}

export const getFileType = (filename: string): string => {
  const extension = getFileExtension(filename)

  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension)) {
    return "image"
  }
  if (["pdf"].includes(extension)) {
    return "pdf"
  }
  if (["doc", "docx", "txt", "rtf", "odt"].includes(extension)) {
    return "document"
  }
  if (["xls", "xlsx", "csv", "ods"].includes(extension)) {
    return "spreadsheet"
  }
  if (["ppt", "pptx", "odp"].includes(extension)) {
    return "presentation"
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return "archive"
  }
  if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
    return "audio"
  }
  if (["mp4", "avi", "mov", "wmv", "mkv", "webm"].includes(extension)) {
    return "video"
  }
  if (["js", "ts", "jsx", "tsx", "html", "css", "json", "py", "java", "c", "cpp", "php"].includes(extension)) {
    return "code"
  }

  return "other"
}

export const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "pdf":
      return "file-text" // Using string identifiers for icons
    case "document":
      return "file-text"
    case "spreadsheet":
      return "file-spreadsheet"
    case "presentation":
      return "file-text"
    case "archive":
      return "file-archive"
    case "audio":
      return "file-audio"
    case "video":
      return "file-video"
    case "code":
      return "file-code"
    case "image":
      return "image"
    default:
      return "file"
  }
}

export const getFileIconColor = (fileType: string) => {
  switch (fileType) {
    case "pdf":
      return "text-red-500"
    case "document":
      return "text-blue-500"
    case "spreadsheet":
      return "text-green-500"
    case "presentation":
      return "text-orange-500"
    case "archive":
      return "text-purple-500"
    case "audio":
      return "text-pink-500"
    case "video":
      return "text-indigo-500"
    case "code":
      return "text-gray-500"
    case "image":
      return "text-teal-500"
    default:
      return "text-gray-500"
  }
}

export const getAvatarColor = (fileType: string) => {
  switch (fileType) {
    case "pdf":
      return "bg-red-100"
    case "document":
      return "bg-blue-100"
    case "spreadsheet":
      return "bg-green-100"
    case "presentation":
      return "bg-orange-100"
    case "archive":
      return "bg-purple-100"
    case "audio":
      return "bg-pink-100"
    case "video":
      return "bg-indigo-100"
    case "code":
      return "bg-gray-100"
    case "image":
      return "bg-teal-100"
    default:
      return "bg-gray-100"
  }
}

