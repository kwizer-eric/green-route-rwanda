import { Brain } from 'lucide-react'

export default function AIProcessingOverlay({ message = 'AI processing...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 rounded-2xl bg-primary-light ai-shimmer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain size={28} className="text-primary animate-pulse-soft" />
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-stone-900">{message}</p>
          <p className="text-sm text-stone-500 mt-1">Analyzing routes and capacity...</p>
        </div>
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-pulse-soft"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
