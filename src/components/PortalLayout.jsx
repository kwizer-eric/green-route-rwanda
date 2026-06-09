import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import JourneyStatusBar from './story/JourneyStatusBar'
import GuidedWalkthrough from './story/GuidedWalkthrough'

const roleFromPath = pathname => {
  if (pathname.startsWith('/farmer')) return 'farmer'
  if (pathname.startsWith('/transporter')) return 'transporter'
  if (pathname.startsWith('/buyer')) return 'buyer'
  if (pathname.startsWith('/admin')) return 'admin'
  return null
}

export default function PortalLayout({ portalName, links }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [walkthroughOpen, setWalkthroughOpen] = useState(false)
  const { pathname } = useLocation()
  const role = roleFromPath(pathname)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden">
      <div className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-100/80">
        <Navbar
          portalName={portalName}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
          onStartWalkthrough={() => setWalkthroughOpen(true)}
        />
      </div>
      <GuidedWalkthrough open={walkthroughOpen} onClose={() => setWalkthroughOpen(false)} />
      <div className="flex w-full max-w-[100vw]">
        <Sidebar links={links} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            {role && <JourneyStatusBar role={role} />}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
