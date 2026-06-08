import { NavLink } from 'react-router-dom'

export default function Sidebar({ links, open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static top-16 lg:top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-stone-100 transform transition-transform duration-300 ease-out lg:transform-none ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex flex-col gap-1 p-4 pt-6 lg:pt-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end ?? false}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-light text-primary border-l-[3px] border-primary -ml-[3px] pl-[calc(1rem+3px)]'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
