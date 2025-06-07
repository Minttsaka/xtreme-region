interface VoiceWaveformProps {
  isActive: boolean
}

export function VoiceWaveform({ isActive }: VoiceWaveformProps) {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${
            isActive ? "animate-pulse h-6" : "h-2"
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isActive ? `${Math.random() * 20 + 10}px` : "8px",
          }}
        />
      ))}
    </div>
  )
}
