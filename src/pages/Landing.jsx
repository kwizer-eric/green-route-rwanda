import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wheat, Truck, ShoppingCart, ArrowRight, Menu, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { portalPathForRole } from '../lib/auth'

const portals = [
  {
    to: '/farmer',
    icon: Wheat,
    title: 'Farmer',
    description: 'List harvest & get matched transport.',
    image: 'https://images.unsplash.com/photo-1509099381441-ea3c0cf98b94?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    to: '/transporter',
    icon: Truck,
    title: 'Transporter',
    description: 'Cut empty return trips, earn more.',
    image: 'https://images.unsplash.com/photo-1633084821075-53d091982ca2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    to: '/buyer',
    icon: ShoppingCart,
    title: 'Buyer',
    description: 'Reliable supply, predictable timing.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'
  },
]

export default function Landing() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user, profile } = useAuth()

  const navLinks = [
    { href: '#problem', label: 'Vision' },
    { href: '#portals', label: 'Portals' },
  ]

  const portalPath = profile?.portal_role ? portalPathForRole(profile.portal_role) : null

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans selection:bg-[#16a34a]/30">
      
      {/* Floating Pill Nav */}
      <nav className="fixed top-6 left-6 right-6 z-50 flex items-start justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="bg-[#1e1e1e]/90 backdrop-blur-md border border-white/10 rounded-full h-12 px-5 flex items-center gap-4 shadow-2xl">
            <Link to="/" className="font-semibold text-white tracking-wide text-sm flex items-center gap-2 group">
              GreenRouteRwanda
            </Link>
            <div className="w-px h-4 bg-white/20"></div>
            <button
              type="button"
              className="text-stone-400 hover:text-white transition-colors"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileNavOpen && (
            <div className="absolute top-14 left-0 w-48 bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl animate-fade-in">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-medium text-stone-300 hover:text-[#16a34a] transition-colors"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {label}
                </a>
              ))}
              <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
                {user && portalPath ? (
                  <Link
                    to={portalPath}
                    className="text-sm font-medium text-[#16a34a] hover:text-[#15803d] transition-colors"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    My portal
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm font-medium text-stone-300 hover:text-[#16a34a] transition-colors"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="text-sm font-medium text-[#16a34a] hover:text-[#15803d] transition-colors"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-[#1e1e1e]/90 backdrop-blur-md border border-white/10 rounded-full h-12 px-2 shadow-2xl">
          {user && portalPath ? (
            <Link
              to={portalPath}
              className="text-sm font-medium text-white hover:text-[#16a34a] px-4 py-2 rounded-full transition-colors"
            >
              My portal
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-stone-300 hover:text-white px-4 py-2 rounded-full transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold text-white bg-[#16a34a] hover:bg-[#15803d] px-4 py-2 rounded-full transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden pt-32 px-6 lg:px-12">
        {/* Background Portrait Image */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="relative w-full max-w-4xl aspect-[3/4] sm:aspect-square lg:aspect-[3/4] opacity-60 mix-blend-lighten">
            <img 
              src="https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=1200" 
              alt="Portrait" 
              className="w-full h-full object-cover"
              style={{ maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)' }}
            />
          </div>
        </div>

        {/* Top Content: Left & Right */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 flex-1 mt-12 sm:mt-24 w-full max-w-7xl mx-auto items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.1] text-white tracking-tight">
              Logistics <br/>
              Reimagined <br/>
              for Rwanda.
            </h1>
          </div>
          
          {/* Right Content */}
          <div className="flex flex-col justify-center lg:items-end lg:text-left">
            <div className="max-w-xs">
              <p className="text-stone-400 leading-relaxed mb-8 text-sm sm:text-base font-light">
                GreenRouteRwanda coordinates farmers, transporters, and buyers in one intelligent system to eliminate empty trips and cut delays.
              </p>
              <a href="#portals" className="inline-flex items-center gap-4 bg-[#16a34a] text-white rounded-full pl-1.5 pr-6 py-1.5 hover:bg-[#15803d] transition-all group shadow-[0_0_30px_-5px_rgba(22,163,74,0.4)]">
                <div className="w-10 h-10 rounded-full bg-white text-[#16a34a] flex items-center justify-center transform group-hover:scale-95 transition-transform">
                  <ArrowRight size={20} />
                </div>
                <span className="font-semibold text-sm">Explore Portals</span>
              </a>
            </div>
          </div>
        </div>

        {/* Massive Bottom Text */}
        <div className="relative z-10 w-full flex justify-center pb-6 pt-12 select-none pointer-events-none">
          <h2 className="text-[13vw] sm:text-[14vw] font-bold tracking-tighter text-white leading-[0.8] whitespace-nowrap opacity-90 mix-blend-overlay">
            GreenRoute
          </h2>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 lg:py-32 px-6 lg:px-12 bg-[#161616] border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
            Rwanda's harvest works. <span className="text-stone-500">Its logistics don't.</span>
          </h2>
          <p className="text-lg text-stone-400 leading-relaxed mb-20 max-w-2xl mx-auto font-light">
            From Musanze to Kigali, we focus exclusively on the movement of goods: matching rural produce with transport, navigating complex routes, and eliminating empty return trips.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-white/5 hover:border-[#16a34a]/30 transition-colors">
              <p className="text-4xl sm:text-5xl font-semibold text-white mb-3 tracking-tighter">20-30%</p>
              <p className="text-sm font-medium text-white tracking-wide uppercase">Post-harvest loss</p>
              <p className="text-sm text-stone-400 mt-3 leading-relaxed font-light">Due to transport delays and fragmented coordination across rural sectors.</p>
            </div>
            <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-white/5 hover:border-[#16a34a]/30 transition-colors">
              <p className="text-4xl sm:text-5xl font-semibold text-white mb-3 tracking-tighter">1/3</p>
              <p className="text-sm font-medium text-white tracking-wide uppercase">Lost in transit</p>
              <p className="text-sm text-stone-400 mt-3 leading-relaxed font-light">Of fresh agricultural value perishes before reaching main Kigali markets.</p>
            </div>
            <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-white/5 hover:border-[#16a34a]/30 transition-colors">
              <p className="text-4xl sm:text-5xl font-semibold text-white mb-3 tracking-tighter">Empty</p>
              <p className="text-sm font-medium text-white tracking-wide uppercase">Return trips</p>
              <p className="text-sm text-stone-400 mt-3 leading-relaxed font-light">Transporters wasting fuel on empty trips returning to the provinces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="portals" className="py-24 lg:py-32 px-6 lg:px-12 bg-[#111111] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
              Explore the platform.
            </h2>
            <p className="text-stone-400 text-lg max-w-2xl leading-relaxed font-light">
              Select a portal to enter the demo and experience the network.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portals.map(({ to, icon: Icon, title, description, image }) => (
              <Link
                key={to}
                to={to}
                className="group relative h-[400px] rounded-3xl overflow-hidden block border border-white/5 bg-[#1e1e1e]"
              >
                <div className="absolute inset-0 z-0">
                  <img src={image} alt={title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105 transform mix-blend-overlay" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent z-10"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                  <div className="w-12 h-12 rounded-full bg-[#1e1e1e] border border-white/10 flex items-center justify-center mb-6 transform group-hover:-translate-y-2 transition-transform duration-500 shadow-xl">
                    <Icon size={20} className="text-[#16a34a]" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">{title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed mb-6 font-light">
                    {description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#16a34a] uppercase tracking-wider">
                    Enter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-12 bg-[#0a0a0a] border-t border-white/5 text-stone-500 text-sm font-light">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-medium text-stone-400">&copy; 2026 GreenRouteRwanda Concept</span>
          <span className="flex items-center gap-2">
            Built for agricultural logistics
          </span>
        </div>
      </footer>
    </div>
  )
}
