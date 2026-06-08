import { Sparkles } from 'lucide-react'

export default function MatchExplanationCard({ factors = [], confidence, compact = false }) {
  if (!factors.length && confidence == null) return null

  return (
    <div className={`rounded-xl border border-primary/15 bg-stone-50/80 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={14} className="text-primary" />
        <span className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
          Why this match{confidence != null ? ` · ${confidence}% confidence` : ''}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {factors.map((f, i) => (
          <span
            key={i}
            title={f.detail}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-700"
          >
            <span className="font-semibold text-primary">{f.impact}</span>
            {f.label}
          </span>
        ))}
      </div>
      {!compact && factors.some(f => f.detail) && (
        <ul className="mt-2 space-y-0.5">
          {factors.filter(f => f.detail).map((f, i) => (
            <li key={i} className="text-xs text-stone-500">· {f.detail}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
