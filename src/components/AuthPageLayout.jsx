import { Link } from 'react-router-dom'

export default function AuthPageLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans flex flex-col">
      <nav className="p-6">
        <Link to="/" className="font-semibold text-white tracking-wide text-sm hover:text-[#16a34a] transition-colors">
          GreenRouteRwanda
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-stone-400 mt-2 text-sm">{subtitle}</p>}
          </div>

          <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-stone-400">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

export function AuthInput({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-stone-300">{label}</label>}
      <input
        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#161616] text-white text-sm placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all"
        {...props}
      />
    </div>
  )
}

export function AuthSelect({ label, children, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-stone-300">{label}</label>}
      <select
        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#161616] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all appearance-none"
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export function AuthButton({ children, className = '', ...props }) {
  return (
    <button
      className={`w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] transition-all disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function AuthError({ message }) {
  if (!message) return null
  return (
    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
      {message}
    </div>
  )
}

export function AuthSuccess({ message }) {
  if (!message) return null
  return (
    <div className="p-3 rounded-xl bg-[#16a34a]/10 border border-[#16a34a]/20 text-[#16a34a] text-sm">
      {message}
    </div>
  )
}
