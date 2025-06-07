import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


export default function CourseProgress({ 
    completionPercentage ,
    totalLessons,
    completedLessons,
    courseTitle
}: {
    completionPercentage: number,
    totalLessons: number,
    completedLessons : number,
    courseTitle:string
}) {



  // Calculate the stroke-dasharray for the circular progress
  const circumference = 2 * Math.PI * 40 // radius is 40
  const strokeDasharray = `${(completionPercentage / 100) * circumference} ${circumference}`

  const getProgressColor = () => {
    if (completionPercentage === 100) return "text-green-600"
    if (completionPercentage >= 75) return "text-blue-600"
    if (completionPercentage >= 50) return "text-yellow-600"
    return "text-orange-600"
  }

  const getBadgeVariant = () => {
    if (completionPercentage === 100) return "bg-green-50 text-green-700 border-green-200"
    if (completionPercentage >= 75) return "bg-blue-50 text-blue-700 border-blue-200"
    if (completionPercentage >= 50) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-orange-50 text-orange-700 border-orange-200"
  }

  return (
    <Card className={`shadow `}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            {courseTitle ? `${courseTitle} Progress` : "Course Progress"}
          </h3>
          <Badge variant="outline" className={getBadgeVariant()}>
            {completedLessons} of {totalLessons} completed
          </Badge>
        </div>

        <div className="relative flex items-center justify-center mb-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                className={`${getProgressColor()} transition-all duration-500 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          {completionPercentage === 100 && (
            <div>
              <p className="text-green-600 font-medium">🎉 Course completed!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
