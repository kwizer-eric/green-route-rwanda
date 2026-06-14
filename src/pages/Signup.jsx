import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Wheat, Truck, ShoppingCart } from 'lucide-react'
import AuthPageLayout, { AuthInput, AuthButton, AuthError, AuthSuccess } from '../components/AuthPageLayout'
import { useAuth } from '../context/AuthContext'
import {
  PUBLIC_PORTAL_ROLES,
  PORTAL_LABELS,
  isPublicPortalRole,
  portalPathForRole,
  resolvePortalRole,
} from '../lib/auth'

const PORTAL_OPTIONS = [
  { value: 'farmer', icon: Wheat, label: 'Farmer', description: 'List harvest & get matched transport' },
  { value: 'transporter', icon: Truck, label: 'Transporter', description: 'Fill trucks, cut empty return trips' },
  { value: 'buyer', icon: ShoppingCart, label: 'Buyer', description: 'Reliable supply, predictable timing' },
]

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signUp, user, profile } = useAuth()

  const portalParam = searchParams.get('portal')
  const initialPortal = isPublicPortalRole(portalParam) ? portalParam : 'farmer'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [portalRole, setPortalRole] = useState(initialPortal)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user && profile?.portal_role) {
      navigate(portalPathForRole(profile.portal_role), { replace: true })
    }
  }, [user, profile, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const role = resolvePortalRole(email, portalRole)
      const { session } = await signUp({ email, password, fullName, portalRole: role })

      if (session) {
        navigate(portalPathForRole(role), { replace: true })
      } else {
        setSuccess('Account created! Check your email to confirm, then sign in.')
      }
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setSubmitting(false)
    }
  }

  const loginLink = isPublicPortalRole(portalRole)
    ? `/login?portal=${portalRole}`
    : '/login'

  const submitLabelRole = resolvePortalRole(email, portalRole)

  return (
    <AuthPageLayout
      title="Create your account"
      subtitle="Choose your portal — you'll always land there after sign in"
      footer={
        <>
          Already have an account?{' '}
          <Link to={loginLink} className="text-[#16a34a] hover:underline font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthError message={error} />
        <AuthSuccess message={success} />

        <div className="space-y-2">
          <p className="text-sm font-medium text-stone-300">Portal</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PORTAL_OPTIONS.map(({ value, icon: Icon, label, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => setPortalRole(value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  portalRole === value
                    ? 'border-[#16a34a] bg-[#16a34a]/10'
                    : 'border-white/10 bg-[#161616] hover:border-white/20'
                }`}
              >
                <Icon size={18} className={portalRole === value ? 'text-[#16a34a]' : 'text-stone-400'} />
                <p className="text-sm font-medium text-white mt-2">{label}</p>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{description}</p>
              </button>
            ))}
          </div>
        </div>

        <AuthInput
          label="Full name"
          type="text"
          required
          autoComplete="name"
          placeholder="Uwimana Jean"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <AuthInput
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthInput
          label="Password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthButton type="submit" disabled={submitting || !PUBLIC_PORTAL_ROLES.includes(portalRole)}>
          {submitting ? 'Creating account…' : `Create ${PORTAL_LABELS[submitLabelRole]} account`}
        </AuthButton>
      </form>
    </AuthPageLayout>
  )
}
