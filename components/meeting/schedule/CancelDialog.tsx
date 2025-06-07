"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Trash2 } from "lucide-react"
import { Meeting } from "@prisma/client"
import { dltMeeting } from "@/app/actions/actions"
import { useRouter } from "next/navigation"

interface CancelDialogProps {
  meeting: Meeting
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CancelDialog({ meeting, isOpen, onOpenChange }: CancelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const  router = useRouter()

  const handleCancel = async () => {
    setIsSubmitting(true)

    try {

        await dltMeeting(meeting.id)

            
    } catch (error) {
      console.error(error)
        
    } finally{
        setIsSubmitting(false)
        onOpenChange(false)
        router.refresh()
    }

    
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Cancel Meeting
          </DialogTitle>
          <DialogDescription>Are you sure you want to cancel {meeting.topic}?</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">This action cannot be undone</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Cancelling this meeting will remove it from your schedule and notify all attendees if selected.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Keep Meeting
          </Button>
          <Button type="button" variant="destructive" onClick={handleCancel} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2">Cancelling</span>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel Meeting
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

