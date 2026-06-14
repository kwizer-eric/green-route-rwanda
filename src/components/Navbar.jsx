import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ portalName, onMenuToggle, menuOpen }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

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
          <span className="font-semibold text-stone-900 tracking-tight text-sm sm:text-base shrink-0">
            GreenRoute
          </span>
          {portalName && (
            <>
              <span className="text-stone-300 hidden sm:block">/</span>
              <span className="text-sm font-medium text-stone-500 hidden sm:block truncate">{portalName}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {profile?.full_name && (
            <span className="text-xs text-stone-500 hidden md:block truncate max-w-[140px]">
              {profile.full_name}
            </span>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-red-600 px-3 sm:px-4 py-2 rounded-full border border-stone-200 hover:border-red-200 hover:bg-red-50 transition-all whitespace-nowrap disabled:opacity-50"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">{signingOut ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
