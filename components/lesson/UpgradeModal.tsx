"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Crown, Clock, Zap, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  usedTime: number
  maxTime: number
}

export function UpgradeModal({ isOpen, onClose, usedTime, maxTime }: UpgradeModalProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    router.push("/i/subscription")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-xl">Usage Limit Reached</DialogTitle>
          </div>
          <DialogDescription>
            You've used {formatTime(usedTime)} out of your {formatTime(maxTime)} free trial time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="border-2 border-gradient-to-r from-yellow-400 to-orange-500">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(usedTime / maxTime) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Free trial: {formatTime(usedTime)} / {formatTime(maxTime)} used
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold text-center">Upgrade to Premium for:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Unlimited conversation time</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Zap className="w-4 h-4 text-green-500" />
                <span>Priority AI response speed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-purple-500" />
                <span>Advanced lesson features</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
