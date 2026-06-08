import { Sparkles } from 'lucide-react'

export default function AIRecommendedBadge({ label = 'AI Recommended' }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-sm">
      <Sparkles size={12} />
      {label}
    </span>
  )
}
