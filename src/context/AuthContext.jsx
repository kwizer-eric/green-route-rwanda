import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { formatAuthError } from '../lib/formatAuthError'
import {
  portalPathForRole,
  ROLE_ENTITY_IDS,
  resolvePortalRole,
  isAdminEmail,
} from '../lib/auth'

const AuthContext = createContext(null)

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, portal_role')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

async function syncAdminProfile(user, profile) {
  if (!user || !isAdminEmail(user.email)) return profile

  if (profile?.portal_role === 'admin') return profile

  const { data, error } = await supabase
    .from('profiles')
    .update({ portal_role: 'admin' })
    .eq('id', user.id)
    .select('id, full_name, portal_role')
    .single()

  if (error) throw error
  return data
}

function profileFromUser(user) {
  const meta = user.user_metadata || {}
  return {
    id: user.id,
    full_name: meta.full_name || '',
    portal_role: resolvePortalRole(user.email, meta.portal_role),
  }
}

async function loadUserProfile(user) {
  try {
    const p = await fetchProfile(user.id)
    return await syncAdminProfile(user, p)
  } catch {
    return profileFromUser(user)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadSession = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) console.error('[Supabase] getSession:', error.message)

      setUser(session?.user ?? null)

      if (session?.user) {
        const p = await loadUserProfile(session.user)
        setProfile(p)
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error('[Supabase] connection error:', formatAuthError(err))
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSession()

    if (!isSupabaseConfigured()) return undefined

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        loadUserProfile(session.user)
          .then(setProfile)
          .finally(() => setLoading(false))
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadSession])

  const signUp = async ({ email, password, fullName, portalRole }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Check .env.local and restart the dev server.')
    }

    const role = resolvePortalRole(email, portalRole)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            portal_role: role,
          },
        },
      })
      if (error) throw error
      return data
    } catch (err) {
      throw new Error(formatAuthError(err))
    }
  }

  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Check .env.local and restart the dev server.')
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      let p = null
      if (data.user) {
        p = await loadUserProfile(data.user)
        setProfile(p)
        setUser(data.user)
      }

      return { ...data, profile: p }
    } catch (err) {
      throw new Error(formatAuthError(err))
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(formatAuthError(error))
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function usePortalIdentity() {
  const { profile } = useAuth()
  const role = profile?.portal_role
  return {
    role,
    entityId: role ? ROLE_ENTITY_IDS[role] : null,
    fullName: profile?.full_name || '',
    portalPath: role ? portalPathForRole(role) : '/',
  }
}
