import { Link } from 'react-router-dom'
import { Leaf, Wheat, Truck, ShoppingCart, Shield, ArrowRight, Users, TrendingDown } from 'lucide-react'
import { platformStats, formatNumber } from '../data/mockData'

const portals = [
  {
    to: '/farmer',
    icon: Wheat,
    title: 'Farmer',
    description: 'List produce, find transport matches, and track deliveries across Rwanda.',
  },
  {
    to: '/transporter',
    icon: Truck,
    title: 'Transporter',
    description: 'Browse jobs, register vehicles, and optimize routes with AI assistance.',
  },
  {
    to: '/buyer',
    icon: ShoppingCart,
    title: 'Buyer',
    description: 'Source fresh produce directly from farmers with transparent pricing.',
  },
  {
    to: '/admin',
    icon: Shield,
    title: 'Admin',
    description: 'Monitor platform activity, AI matching, and impact metrics in real time.',
  },
]

const stats = [
  { value: formatNumber(platformStats.farmers), label: 'Farmers' },
  { value: formatNumber(platformStats.transporters), label: 'Transporters' },
  { value: formatNumber(platformStats.buyers), label: 'Buyers' },
  { value: `${platformStats.foodWasteReduction}%`, label: 'Less Food Waste' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-stone-900 tracking-tight">GreenRoute Rwanda</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-stone-500">
            <a href="#portals" className="hover:text-stone-900 transition-colors">Portals</a>
            <a href="#impact" className="hover:text-stone-900 transition-colors">Impact</a>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,163,74,0.06),transparent_60%)]" />
        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-primary text-sm font-medium mb-8 shadow-sm">
            <TrendingDown size={14} />
            Reducing post-harvest loss across Rwanda
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 tracking-tight leading-[1.08] max-w-3xl mx-auto">
            AI-Driven Logistics for Rwanda's Agricultural Future
          </h1>
          <p className="mt-6 text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            Connecting farmers, transporters, and buyers on one intelligent platform — 
            from field to market, with less waste and more value.
          </p>
        </div>
      </section>

      <section id="portals" className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portals.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white rounded-2xl border border-stone-100 p-6 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                <Icon size={22} className="text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-5">{description}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                Enter Portal <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="impact" className="border-t border-stone-100 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl sm:text-4xl font-semibold tracking-tight">{value}</p>
                <p className="text-sm text-stone-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>Built for Rwanda's agricultural ecosystem</span>
          </div>
          <span>&copy; 2026 GreenRoute Rwanda</span>
        </div>
      </footer>
    </div>
  )
}
