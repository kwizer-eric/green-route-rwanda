import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wheat, Truck, ShoppingCart, Shield, ArrowRight, Users, TrendingDown,
  AlertTriangle, Route, Brain, MapPin, Menu, X,
} from 'lucide-react'
import { platformStats, formatNumber } from '../data/mockData'
import { SAMPLE_MATCH } from '../utils/aiMatching'
import HeroRouteMap from '../components/story/HeroRouteMap'
import ValueChainDiagram from '../components/story/ValueChainDiagram'
import MatchExplanationCard from '../components/story/MatchExplanationCard'
import GuidedWalkthrough, { WalkthroughTrigger } from '../components/story/GuidedWalkthrough'

const portals = [
  {
    to: '/farmer',
    icon: Wheat,
    title: 'Farmer',
    description: 'List harvest and get matched transport — no informal brokers, no waiting.',
  },
  {
    to: '/transporter',
    icon: Truck,
    title: 'Transporter',
    description: 'Fill your truck, cut empty return trips, earn from coordinated loads.',
  },
  {
    to: '/buyer',
    icon: ShoppingCart,
    title: 'Buyer',
    description: 'Place orders with coordinated delivery — reliable supply, predictable timing.',
  },
  {
    to: '/admin',
    icon: Shield,
    title: 'Admin',
    description: 'See logistics bottlenecks before they become post-harvest loss.',
  },
]

const pilotDistricts = [
  { name: 'Nyagatare', crops: 'Maize, Beans, Sorghum', need: 'High' },
  { name: 'Musanze', crops: 'Vegetables, Potatoes', need: 'High' },
  { name: 'Rwamagana', crops: 'Rice, Fruits', need: 'Medium' },
  { name: 'Huye', crops: 'Coffee, Beans', need: 'Medium' },
  { name: 'Rubavu', crops: 'Vegetables, Fish', need: 'Medium' },
]

const stats = [
  { value: formatNumber(platformStats.farmers), label: 'Farmers (projected)' },
  { value: formatNumber(platformStats.transporters), label: 'Transporters (projected)' },
  { value: formatNumber(platformStats.buyers), label: 'Buyers (projected)' },
  { value: `${platformStats.foodWasteReduction}%`, label: 'Less food waste (target)' },
]

export default function Landing() {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const navLinks = [
    { href: '#problem', label: 'Problem' },
    { href: '#solution', label: 'Solution' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#impact', label: 'Impact' },
    { href: '#portals', label: 'Portals' },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <GuidedWalkthrough open={walkthroughOpen} onClose={() => setWalkthroughOpen(false)} />

      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          <Link to="/" className="font-semibold text-stone-900 tracking-tight hover:text-primary transition-colors text-sm sm:text-base">
            GreenRoute Rwanda
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-stone-500">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} className="hover:text-stone-900 transition-colors">{label}</a>
            ))}
          </div>
          <button
            type="button"
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileNavOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                onClick={() => setMobileNavOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,163,74,0.06),transparent_60%)]" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                Interactive Concept Demo
              </div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white border border-stone-200 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4 shadow-sm">
                <TrendingDown size={14} className="shrink-0" />
                <span className="leading-snug">Logistics-first · Not another marketplace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.1]">
                AI-Driven Logistics for Rwanda's Agricultural Future
              </h1>
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-stone-600 leading-relaxed">
                Rwanda's farms produce enough. The bottleneck is{' '}
                <strong className="text-stone-800">moving goods</strong> — fragmented transport,
                empty return trips, and 20–30% post-harvest loss on perishables.
              </p>
              <p className="mt-3 text-stone-600 leading-relaxed">
                GreenRoute coordinates farmers, transporters, and buyers in one system —
                matching supply, demand, and transport capacity in real time.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
                <WalkthroughTrigger onClick={() => setWalkthroughOpen(true)} />
                <a
                  href="#portals"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-stone-200 bg-white text-stone-700 font-medium text-sm hover:border-primary/30 hover:bg-primary-light transition-all"
                >
                  Explore Portals <ArrowRight size={16} />
                </a>
              </div>
            </div>
            <div className="relative">
              <HeroRouteMap />
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-y border-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={20} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">The Problem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Agriculture works. Logistics doesn't.
          </h2>
          <p className="mt-4 text-stone-600 max-w-2xl leading-relaxed">
            Agriculture employs 60%+ of Rwandans and contributes ~25% of GDP — yet getting produce
            from rural farms to urban markets remains fragmented, expensive, and slow.
          </p>
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {[
              { stat: '20–30%', label: 'Post-harvest loss on perishables', sub: 'Delays & poor coordination' },
              { stat: '37%', label: 'Sub-Saharan food lost in supply chains', sub: 'FAO estimate' },
              { stat: 'Empty trips', label: 'Transporters return with partial or no loads', sub: 'Fuel wasted, income lost' },
            ].map(item => (
              <div key={item.label} className="p-6 rounded-2xl bg-stone-50 border border-stone-100">
                <p className="text-2xl font-semibold text-stone-900">{item.stat}</p>
                <p className="text-sm font-medium text-stone-700 mt-2">{item.label}</p>
                <p className="text-xs text-stone-500 mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Route size={20} className="text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">The Solution</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Logistics-first coordination — not just market access
          </h2>
          <p className="mt-4 text-stone-600 max-w-2xl leading-relaxed">
            Unlike price-info platforms (E-Soko) or urban ride apps (SafeBoda), GreenRoute focuses on
            the movement of goods: matching produce with transport, optimizing routes, and reducing empty trips.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { title: 'Connect all stakeholders', desc: 'Farmers, transporters, and buyers share one logistics network.' },
              { title: 'Match supply + demand + transport', desc: 'AI pairs produce listings with the best available vehicle and route.' },
              { title: 'Optimize every trip', desc: 'Combine nearby loads, cut empty returns, reduce spoilage and emissions.' },
            ].map(item => (
              <div key={item.title} className="p-6 rounded-2xl bg-white border border-stone-100">
                <h3 className="font-semibold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-y border-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Brain size={20} className="text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">How It Works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mb-2">
            From field to market in one coordinated flow
          </h2>
          <p className="text-stone-600 mb-8">Click any step to try it in the interactive demo.</p>
          <ValueChainDiagram linked />

          <div className="mt-12 p-6 rounded-2xl border border-primary/15 bg-primary-light/20">
            <h3 className="font-semibold text-stone-900 mb-1">AI matching — transparent, not a black box</h3>
            <p className="text-sm text-stone-600 mb-4">
              In this demo, matching is rule-based and fully visible. In production, models improve with more trip data.
            </p>
            <MatchExplanationCard factors={SAMPLE_MATCH.factors} confidence={SAMPLE_MATCH.confidence} />
          </div>
        </div>
      </section>

      {/* Pilot districts */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-y border-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <MapPin size={20} className="text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Pilot Districts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mb-6 sm:mb-8">Phase 1 rollout targets</h2>
          <div className="overflow-x-auto rounded-2xl border border-stone-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-6 py-3 font-medium text-stone-500">District</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500">Key Crops</th>
                  <th className="text-left px-6 py-3 font-medium text-stone-500">Transport Need</th>
                </tr>
              </thead>
              <tbody>
                {pilotDistricts.map(d => (
                  <tr key={d.name} className="border-b border-stone-50 last:border-0">
                    <td className="px-6 py-3 font-medium text-stone-900">{d.name}</td>
                    <td className="px-6 py-3 text-stone-600">{d.crops}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        d.need === 'High' ? 'bg-primary-light text-primary' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {d.need}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Portals */}
      <section id="portals" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mb-2">Explore the demo</h2>
          <p className="text-stone-600 mb-8">Each portal shows one role in the same logistics network.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>
      </section>

      {/* Impact stats */}
      <section id="impact" className="border-t border-stone-100 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <p className="text-center text-sm text-stone-400 mb-8">Projected impact at national scale — demo metrics for illustration</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl sm:text-4xl font-semibold tracking-tight">{value}</p>
                <p className="text-sm text-stone-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <WalkthroughTrigger onClick={() => setWalkthroughOpen(true)} className="mx-auto" />
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-100 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>Built for Rwanda's agricultural logistics ecosystem</span>
          </div>
          <span>&copy; 2026 GreenRoute Rwanda · Concept Demo</span>
        </div>
      </footer>
    </div>
  )
}
