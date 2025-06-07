"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ThumbsUp, Trash } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { deleteUserReview, toggleReviewLike } from "@/app/actions/channel"
import {  Review } from "@/types/channel"

interface ReviewCardProps {
  review: Review
  user: null | Record<string, any>
  setReviews: Dispatch<SetStateAction<Review[]>>
}

export function ReviewCard({ setReviews, user,  review }: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)

  const alreadLiked = review.reviewLike.find(like => like.userId === user?.id)

  useEffect(()=>{
    setHelpfulCount(review.helpfulCount as number)
    if(alreadLiked){
      setIsLiked(true)
    }
  },[])

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      const result = await toggleReviewLike(review.id, "HELPFUL")
      if (result.success) {
        setIsLiked(!isLiked)
        setHelpfulCount((prev) => (isLiked ? prev - 1 : prev + 1))
      }
    } catch (error) {
      console.error("Failed to like review:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const deleteReview = async () => {
  
    try {
      const result = await deleteUserReview(review.id)
      if (result.success) {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== result.id));

      }
    } catch (error) {
      console.error("Failed to delete review:", error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card className="border-none border-gray-200 transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Review Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage className="object-cover" src={review.user.image || "/placeholder.svg"} />
                <AvatarFallback>
                  {(review.user.name ?? '')
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                  </span>
                </div>
                {review.user.career && <p className="text-xs text-gray-500">{review.user.career}</p>}
              </div>
            </div>

            {review.userId === user?.id &&
            <Button onClick={deleteReview } variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <Trash className="w-4 h-4" />
            </Button>
            }
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <p className="text-gray-700 leading-relaxed">{review.content}</p>
          </div>

          {/* Review Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-1 ${isLiked ? "text-blue-600 bg-blue-50" : "text-gray-600"}`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">Helpful ({helpfulCount})</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
