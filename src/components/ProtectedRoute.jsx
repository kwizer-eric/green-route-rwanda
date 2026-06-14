import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isAdminEmail, portalPathForRole } from '../lib/auth'

export default function ProtectedRoute({ allowedRole, children }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    const loginTo = allowedRole === 'admin' ? '/login' : `/login?portal=${allowedRole}`
    return (
      <Navigate
        to={loginTo}
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  if (allowedRole === 'admin' && !isAdminEmail(user.email)) {
    return <Navigate to={portalPathForRole(profile?.portal_role || 'farmer')} replace />
  }

  if (profile?.portal_role && profile.portal_role !== allowedRole) {
    return <Navigate to={portalPathForRole(profile.portal_role)} replace />
  }

  return children
}
