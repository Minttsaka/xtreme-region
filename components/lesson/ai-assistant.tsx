"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useConversation } from "@11labs/react";
import { Button } from "../ui/button";
import { Mic, MicOff, Square } from "lucide-react";
import { toast } from "sonner";
import { useUsageTracker } from "@/app/hook/use-usage-tracker";
import { UsageDisplay } from "./UsageDisplay";
import { UpgradeModal } from "./UpgradeModal";

interface AIAssistantProps {
  title:string
  content:string
  userName:string
}

export function AIAssistant({ 
  title,
  content ,
  userName
}:AIAssistantProps) {

  const [hasPermission, setHasPermission] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConversationActive, setIsConversationActive] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const {
    usageData,
    currentSessionTime,
    isTracking,
    hasFullAccess,
    startTracking,
    stopTracking,
    getRemainingTime,
    canStartConversation,
    resetUsage,
    maxUsageSeconds,
  } = useUsageTracker()

    useEffect(() => {
    if (isTracking && !hasFullAccess && getRemainingTime() <= 0) {
      handleEndConversation()
      setShowUpgradeModal(true)
    }
  }, [currentSessionTime, isTracking, hasFullAccess])

  const conversation = useConversation({
    onConnect: () => {
    },
    onDisconnect: () => {
    },
    onMessage: () => {
    },
    onError: (error: string | Error) => {
      setErrorMessage(typeof error === "string" ? error : error.message);
      toast(errorMessage)
      console.error("Error:", error);
    },
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    // Request microphone permission on component mount
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        setErrorMessage("Microphone access denied");
        console.error("Error accessing microphone:", error);
      }
    };

    requestMicPermission();
  }, []);

  const handleStartConversation = async () => {
    try {

      if (!canStartConversation()) {
        setShowUpgradeModal(true)
        return
      }

      if (!startTracking()) {
        setShowUpgradeModal(true)
        return
      }

      // Replace with your actual agent ID or URL
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
        overrides: {
          agent: {
              prompt: {
                  prompt: content
              },
              firstMessage: `Hi ${userName}, Ask me anything about this slide ${title}`,
          },
        }
          
      });

    } catch (error) {
      setErrorMessage("Failed to start conversation");
      console.error("Error starting conversation:", error);
    }
  };

  const handleEndConversation = async () => {
    try {

      setIsConversationActive(false)
      stopTracking()

      await conversation.endSession();
    } catch (error) {
      setErrorMessage("Failed to end conversation");
      console.error("Error ending conversation:", error);
    }
  };

  return (
    <Card className="absolute top-1 right-1 h-fit bg-white/95 backdrop-blur-xl border border-blue-200 shadow-xl rounded-full shadow-blue-500/10">
      <CardContent className="p-2 flex items-center justify-between gap-2">
        <UsageDisplay
          currentTime={currentSessionTime}
          totalUsed={usageData?.totalUsed || 0}
          maxTime={maxUsageSeconds}
          isTracking={isTracking}
          hasFullAccess={hasFullAccess}
        />

        <div className="flex items-center space-x-2">
 
          <div className="flex items-center space-x-4">
      {/* Main Talk Button */}
            <Button
              onClick={handleStartConversation}
              disabled={!hasPermission}
              className={` rounded-full text-white font-semibold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                isSpeaking
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-red-500/50"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-cyan-500/50"
              }`}
            >
              {isSpeaking ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>

            {/* Stop Button */}
            {status === "connected" && (
              <Button
                onClick={handleEndConversation}
                variant="outline"
                className=" rounded-full border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all duration-300"
              >
                <Square className="w-6 h-6" />
              </Button>
            )}

            {/* Status Indicator */}
            {status === "connected" && (<div className="flex flex-col items-center space-y-2">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  isSpeaking ? "bg-purple-500 animate-pulse" : "bg-cyan-500 animate-pulse"
                }`}
              />
              <span className="text-xs text-gray-400 font-medium">
                {isSpeaking ? "Speaking" : "Listening"}
              </span>
            </div>
          )}
          </div>
        </div>
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          usedTime={(usageData?.totalUsed || 0) + currentSessionTime}
          maxTime={maxUsageSeconds}
        />
      </CardContent>
    </Card>
  )
}
