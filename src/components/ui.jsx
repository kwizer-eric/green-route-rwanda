export function StatCard({ label, value, icon: Icon, subtext }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 sm:space-y-2 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-stone-500 truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight break-words">{value}</p>
          {subtext && <p className="text-xs text-stone-400">{subtext}</p>}
        </div>
        {Icon && (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
            <Icon size={20} className="text-primary" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  )
}

export function PageHeader({ title, description }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">{title}</h1>
      {description && <p className="text-stone-600 mt-1.5 text-sm sm:text-[15px] leading-relaxed">{description}</p>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-100 ${className}`}>
      {children}
    </div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
    secondary: 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-50',
    ghost: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <input
        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        {...props}
      />
    </div>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <select
        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export function Textarea({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-stone-700">{label}</label>}
      <textarea
        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        rows={3}
        {...props}
      />
    </div>
  )
}
