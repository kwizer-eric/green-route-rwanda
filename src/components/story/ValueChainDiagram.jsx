import { Link } from 'react-router-dom'
import { Wheat, ShoppingCart, Brain, Truck, MapPin, TrendingDown, ArrowRight } from 'lucide-react'

const steps = [
  { icon: Wheat, label: 'List', desc: 'Farmer signals harvest', to: '/farmer/list', step: 1 },
  { icon: ShoppingCart, label: 'Order', desc: 'Buyer adds demand', to: '/buyer/browse', step: 2 },
  { icon: Brain, label: 'Match', desc: 'AI pairs supply + transport', to: '/admin/matching', step: 3 },
  { icon: Truck, label: 'Route', desc: 'Transporter fills the truck', to: '/transporter/jobs', step: 4 },
  { icon: MapPin, label: 'Deliver', desc: 'Goods reach the market', to: '/transporter/trips', step: 5 },
  { icon: TrendingDown, label: 'Impact', desc: 'Less waste, more value', to: '/admin/impact', step: 6 },
]

export default function ValueChainDiagram({ linked = false, compact = false }) {
  return (
    <div className={compact ? '' : 'py-4'}>
      <div className={`grid gap-3 ${compact ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}>
        {steps.map(({ icon: Icon, label, desc, to, step }, i) => {
          const content = (
            <div className="relative group text-center p-4 rounded-2xl border border-stone-100 bg-white hover:border-primary/30 hover:shadow-md transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-3 group-hover:bg-primary transition-colors">
                <Icon size={20} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs font-bold text-primary mb-0.5">Step {step}</p>
              <p className="text-sm font-semibold text-stone-900">{label}</p>
              {!compact && <p className="text-xs text-stone-500 mt-1 leading-snug">{desc}</p>}
              {linked && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it <ArrowRight size={12} />
                </span>
              )}
            </div>
          )

          return linked ? (
            <Link key={label} to={to}>{content}</Link>
          ) : (
            <div key={label}>{content}</div>
          )
        })}
      </div>
      {!compact && (
        <p className="text-center text-xs text-stone-400 mt-4">
          One coordinated logistics network — not four disconnected apps
        </p>
      )}
    </div>
  )
}
