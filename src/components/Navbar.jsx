import { Link } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'

export default function Navbar({ portalName, onMenuToggle, menuOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 -ml-2 text-stone-500 hover:text-stone-800 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-stone-900 tracking-tight hidden sm:block">
              GreenRoute
            </span>
          </Link>
          {portalName && (
            <>
              <span className="text-stone-300 hidden sm:block">/</span>
              <span className="text-sm font-medium text-stone-500 hidden sm:block">{portalName}</span>
            </>
          )}
        </div>
        <Link
          to="/"
          className="text-sm font-medium text-stone-600 hover:text-primary px-4 py-2 rounded-full border border-stone-200 hover:border-primary/30 hover:bg-primary-light transition-all"
        >
          Switch Portal
        </Link>
      </div>
    </header>
  )
}
