import { Lightbulb } from 'lucide-react'

export default function InsightCallout({ children }) {
  return (
    <div className="mb-6 flex gap-3 rounded-xl border border-primary/15 bg-primary-light/40 px-4 py-3">
      <Lightbulb size={18} className="text-primary shrink-0 mt-0.5" />
      <p className="text-sm text-stone-700 leading-relaxed">{children}</p>
    </div>
  )
}
