import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthPageLayout, { AuthInput, AuthButton, AuthError } from '../components/AuthPageLayout'
import { useAuth } from '../context/AuthContext'
import { PORTAL_LABELS, isPublicPortalRole, isPortalRole, portalPathForRole } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn, user, profile } = useAuth()

  const portalParam = searchParams.get('portal')
  const portalHint = isPublicPortalRole(portalParam) ? PORTAL_LABELS[portalParam] : null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user && profile?.portal_role) {
      navigate(portalPathForRole(profile.portal_role), { replace: true })
    }
  }, [user, profile, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const { profile: signedInProfile } = await signIn({ email, password })
      const role = signedInProfile?.portal_role

      if (isPortalRole(role)) {
        navigate(portalPathForRole(role), { replace: true })
      } else {
        setError('Account profile not found. Contact support.')
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  const signupLink = portalHint
    ? `/signup?portal=${portalParam}`
    : '/signup'

  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle={
        portalHint
          ? `Sign in to access the ${portalHint} portal`
          : 'Sign in to your GreenRoute account'
      }
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to={signupLink} className="text-[#16a34a] hover:underline font-medium">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthError message={error} />
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthButton type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </AuthButton>
      </form>
    </AuthPageLayout>
  )
}
