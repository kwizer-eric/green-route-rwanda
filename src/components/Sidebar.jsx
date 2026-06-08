import { NavLink } from 'react-router-dom'

export default function Sidebar({ links, open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-40 lg:hidden"
          style={{ top: 'var(--portal-header-h)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed lg:sticky z-50 w-64 shrink-0 bg-white border-r border-stone-100
          top-[var(--portal-header-h)] h-[calc(100dvh-var(--portal-header-h))]
          overflow-y-auto overscroll-contain
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          left-0 lg:self-start
        `}
      >
        <nav className="flex flex-col gap-1 p-3 sm:p-4 pt-4 sm:pt-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end ?? false}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-light text-primary border-l-[3px] border-primary -ml-[3px] pl-[calc(0.75rem+3px)] sm:pl-[calc(1rem+3px)]'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                  <span className="truncate">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
