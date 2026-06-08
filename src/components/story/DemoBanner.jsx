import { Info } from 'lucide-react'

export default function DemoBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-3 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-sm text-amber-900 text-center leading-snug">
        <Info size={14} className="shrink-0 hidden sm:block" />
        <span>
          <strong>Interactive Concept Demo</strong>
          <span className="hidden sm:inline"> — illustrative data, not production software.</span>
          <span className="sm:hidden"> · Demo data only</span>
        </span>
      </div>
    </div>
  )
}
