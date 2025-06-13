"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { checkConferenceAuth } from "@/app/utils/helpers"
import { useSession } from "@/lib/client-session"

export default function RedirectVercel({id}:{id:string}) {
  const [progress, setProgress] = useState(0)
  const [countdown, setCountdown] = useState(5)
  const [redirectComplete, setRedirectComplete] = useState(false)
  const { session, loading, logout, isAuthenticated } = useSession()

  // URL to redirect to
  const redirectUrl = `${process.env.NEXT_PUBLIC_CONFERENCE_URL}/join/${id}`

  useEffect(() => {
    // Define an async function inside useEffect to handle the session check
    const initializeRedirect = async () => {
      try {
        // Call the provided function to check conference authentication
        await checkConferenceAuth();
        // If authentication check returns a redirect URL, use it
        // Otherwise fall back to the default URL
        const targetUrl = redirectUrl;
        
        // Start the progress animation
        const progressInterval = setInterval(() => {
          setProgress((prevProgress) => {
            const newProgress = prevProgress + 0.8;
            return newProgress >= 100 ? 100 : newProgress;
          });
        }, 40);
        
        // Start the countdown timer
        if(isAuthenticated){
        const countdownInterval = setInterval(() => {
          setCountdown((prevCount) => {
            const newCount = prevCount - 1;
            if (newCount <= 0) {
              clearInterval(countdownInterval);
              setRedirectComplete(true);
              
              // Perform the actual redirect when countdown completes
              setTimeout(() => {
                window.location.href = targetUrl;
              }, 1000);
              
              return 0;
            }
            return newCount;
          });
        }, 1000);
        
        
        // Clean up function to clear intervals when component unmounts
        return () => {
          clearInterval(progressInterval);
          clearInterval(countdownInterval);
        };
    }
      } catch (error) {
        // Handle any errors during authentication check
        console.error("Authentication check failed:", error);
        
        // You could set an error state here to display to the user
        // setAuthError(true);
        
        // Or redirect to an error page
        // window.location.href = "/auth-error";
      }
    };
    
    // Call the async function
    initializeRedirect();
    
    // No dependencies needed as we want this to run once on mount
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Futuristic background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-black"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>

        {/* Animated particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-500/80 shadow-[0_0_15px_5px_rgba(6,182,212,0.5)]"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 2 + 0.5,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}

        {/* Glowing orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xs mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="backdrop-blur-md bg-slate-900/30 rounded-xl border border-slate-700/50 p-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
        >
          <div className="flex flex-col items-center text-center space-y-5">
            {/* Futuristic loader */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-cyan-500/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-1 rounded-full border border-transparent border-b-blue-500/70"
                animate={{ rotate: -180 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(6,182,212,0.7)]"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xs font-light tracking-wider text-cyan-100 uppercase">
                {redirectComplete ? "Redirect initialized" : "System transfer in progress"}
              </h1>
              <p className="text-[10px] text-slate-400 font-light">
                {redirectComplete ? "Transfer protocol complete" : `Automatic transfer in ${countdown}s`}
              </p>
            </div>

            <div className="w-full space-y-1.5">
              <div className="h-0.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
                <span>SYS.REDIRECT</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
            </div>

            <div className="w-full pt-1">
              <p className="text-[8px] font-mono text-slate-500 tracking-tight">
                DEST: <span className="text-slate-400">{redirectUrl}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Digital code effect */}
        <div className="mt-4 overflow-hidden h-6">
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
            <p className="text-[8px] font-mono text-cyan-500/70 text-center tracking-widest">
              {Array.from({ length: 32 })
                .map(() => Math.floor(Math.random() * 2))
                .join("")}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
