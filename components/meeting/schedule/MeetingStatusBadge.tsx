import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock3, Zap } from "lucide-react"
import { combineDateAndTime } from "@/app/utils/meeting-status"

interface MeetingStatusBadgeProps {
  startTime: Date
  startDate: Date
  duration: number
}

export function MeetingStatusBadge({ startTime, startDate, duration }: MeetingStatusBadgeProps) {
  const now = new Date()
  const actualStartTime = combineDateAndTime(startDate, startTime)
  const endTime = new Date(actualStartTime.getTime() + duration * 60000)

  if (now < actualStartTime) {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
        <Clock3 className="w-3 h-3" /> Waiting
      </Badge>
    )
  } else if (now >= actualStartTime && now <= endTime) {
    return (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1 animate-pulse"
      >
        <Zap className="w-3 h-3" /> In Progress
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" /> Completed
      </Badge>
    )
  }
}

