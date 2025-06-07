import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, FileText, Award, ChevronRight, ChevronLeft } from 'lucide-react'

interface Tip {
  icon: React.ElementType
  title: string
  description: string
}

const tips: Tip[] = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description: "Engage with our bite-sized, interactive lessons designed for optimal learning."
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch expert-led video tutorials to reinforce your understanding of key concepts."
  },
  {
    icon: FileText,
    title: "Practice Exercises",
    description: "Test your knowledge with hands-on exercises and quizzes after each lesson."
  },
  {
    icon: Award,
    title: "Earn Certifications",
    description: "Complete course milestones to earn certificates and showcase your skills."
  }
]

const TipsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentTip, setCurrentTip] = useState(0)

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length)
  }

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-indigo-800">Welcome to Your Learning Journey!</DialogTitle>
              <DialogDescription className="text-xs text-indigo-600">
                Heres what you can expect in this course:
              </DialogDescription>
            </DialogHeader>
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="flex flex-col items-center text-center">
                <h3 className="text-sm font-semibold text-indigo-800 mb-1">{tips[currentTip].title}</h3>
                <p className="text-xs text-indigo-600">{tips[currentTip].description}</p>
              </div>
            </motion.div>
            <DialogFooter className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={prevTip} className="text-xs">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button variant="outline" size="sm" onClick={nextTip} className="text-xs">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <Button variant="default" size="sm" onClick={onClose} className="text-xs">
                Got it!
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default TipsModal

