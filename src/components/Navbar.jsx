import { Link } from 'react-router-dom'
import { Menu, X, Play } from 'lucide-react'

export default function Navbar({ portalName, onMenuToggle, menuOpen, onStartWalkthrough }) {
  return (
    <header className="bg-white/80 border-b border-stone-100 lg:border-b-0">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 gap-3">
        <div className="flex items-center gap-4 min-w-0">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 -ml-2 text-stone-500 hover:text-stone-800 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <Link to="/" className="group shrink-0">
            <span className="font-semibold text-stone-900 tracking-tight text-sm sm:text-base group-hover:text-primary transition-colors">
              GreenRoute
            </span>
          </Link>
          {portalName && (
            <>
              <span className="text-stone-300 hidden sm:block">/</span>
              <span className="text-sm font-medium text-stone-500 hidden sm:block truncate">{portalName}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onStartWalkthrough && (
            <button
              onClick={onStartWalkthrough}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary px-2.5 sm:px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary-light transition-all"
            >
              <Play size={12} /> <span className="hidden sm:inline">Guided Demo</span><span className="sm:hidden">Demo</span>
            </button>
          )}

          <Link
            to="/"
            className="text-xs sm:text-sm font-medium text-stone-600 hover:text-primary px-3 sm:px-4 py-2 rounded-full border border-stone-200 hover:border-primary/30 hover:bg-primary-light transition-all whitespace-nowrap"
          >
            Home
          </Link>
        </div>
      </div>
    </header>
  )
}
