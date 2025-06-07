"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MessageSquare, Filter } from "lucide-react"
import { ReviewCard } from "./ReviewCard"
import {  Review } from "@/types/channel"

interface ReviewSectionProps {
  user:null | Record<string, any>
  onWriteReview: () => void
  reviews:Review[]
  setReviews: Dispatch<SetStateAction<Review[]>>
}

export function ReviewSection({setReviews, user, reviews, onWriteReview }: ReviewSectionProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Mock reviews data - in real app, this would come from props or API


  const filteredReviews = reviews.filter((review) => {
    if (filterRating !== "all" && review.rating !== Number.parseInt(filterRating)) return false
    return true
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime()
      case "helpful":
        return (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0)
      case "rating_high":
        return b.rating - a.rating
      case "rating_low":
        return a.rating - b.rating
      default: // newest
        return b.createdAt.getTime() - a.createdAt.getTime()
    }
  })
  
  return (
    <div className="space-y-6 mt-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-green-100 rounded-lg">
          <MessageSquare className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Reviews ({reviews.length})</h3>
          <p className="text-sm text-gray-600">Share your experience and read what others think</p>
        </div>
        {user && 
        <Button onClick={onWriteReview} className="bg-green-600 hover:bg-green-700">
          <MessageSquare className="w-4 h-4 mr-2" />
          Write Review
        </Button>}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating_high">Highest Rating</SelectItem>
                <SelectItem value="rating_low">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {sortedReviews.length} of {reviews.length} reviews
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Label htmlFor="rating-filter" className="text-sm">
                Rating:
              </Label>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-32" id="rating-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => <ReviewCard setReviews={setReviews} user={user} key={review.id} review={review} />)
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600 mb-4">
              {filterRating !== "all"
                ? "Try adjusting your filters to see more reviews."
                : "Be the first to review this course!"}
            </p>
            <Button onClick={onWriteReview} variant="outline">
              Write the First Review
            </Button>
          </div>
        )}
      </div>

      {/* Load More */}
      {sortedReviews.length > 0 && sortedReviews.length < reviews.length && (
        <div className="text-center pt-6">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      )}
    </div>
  )
}
