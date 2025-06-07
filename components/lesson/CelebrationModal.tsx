"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface CelebrationModalProps {
  show: boolean
  type: "lesson" | "course"
  onClose: () => void
}

export function CelebrationModal({ show, type, onClose }: CelebrationModalProps) {
  const celebrationConfig = {

    lesson: {
      title: "Lesson Completed! 🚀",
      message: "Awesome! Moving to the next lesson...",
      color: "from-purple-400 to-pink-500",
      emoji: "🚀",
      duration: 9000,
    },
    course: {
      title: "Course Completed! 🏆",
      message: "Congratulations! You've mastered this course!",
      color: "from-yellow-400 to-red-500",
      emoji: "🏆",
      duration: 9000,
    },
  }

  const config = celebrationConfig[type]

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              y: 50,
              transition: { duration: 0.2 },
            }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div
              className={`bg-gradient-to-r ${config.color} p-8 rounded-2xl text-white text-center max-w-md w-full mx-4 relative shadow-2xl`}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-2 right-2 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Animated Emoji */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  times: [0, 0.6, 1],
                }}
                className="text-6xl mb-4"
              >
                {config.emoji}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-4"
              >
                {config.title}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg mb-6"
              >
                {config.message}
              </motion.p>

              {/* Special Course Completion Content */}
              {type === "course" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4"
                >
                  <div className="text-4xl mb-2">🎊🎉🏆🎉🎊</div>
                  <p className="text-sm opacity-90">Youre amazing!</p>
                  <div className="mt-4 bg-white/20 rounded-lg p-3">
                    <p className="text-xs">Youll be redirected to your achievements page shortly...</p>
                  </div>
                </motion.div>
              )}

              {/* Progress Indicator for Lesson/Course */}
              {(type === "lesson" || type === "course") && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: config.duration / 1000,
                    ease: "linear",
                  }}
                  className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div className="h-full bg-white rounded-full" />
                </motion.div>
              )}

              {/* Confetti Effect for Course Completion */}
              {type === "course" && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        y: 0,
                        x: Math.random() * 100 + "%",
                        rotate: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: [0, -100, -200],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 2,
                        delay: Math.random() * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 1,
                      }}
                      className="absolute w-2 h-2 bg-white rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
