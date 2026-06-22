export const ADMIN_EMAIL = 'ijay07201@gmail.com'

export const PUBLIC_PORTAL_ROLES = ['farmer', 'transporter', 'buyer']
export const PORTAL_ROLES = [...PUBLIC_PORTAL_ROLES, 'admin']

export const PORTAL_PATHS = {
  farmer: '/farmer',
  transporter: '/transporter',
  buyer: '/buyer',
  admin: '/admin',
}

export const PORTAL_LABELS = {
  farmer: 'Farmer',
  transporter: 'Transporter',
  buyer: 'Buyer',
  admin: 'Admin',
}

export function portalPathForRole(role) {
  return PORTAL_PATHS[role] || '/'
}

export function isPortalRole(value) {
  return PORTAL_ROLES.includes(value)
}

export function isPublicPortalRole(value) {
  return PUBLIC_PORTAL_ROLES.includes(value)
}

export function isAdminEmail(email) {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

export function resolvePortalRole(email, requestedRole = 'farmer') {
  if (isAdminEmail(email)) return 'admin'
  return isPublicPortalRole(requestedRole) ? requestedRole : 'farmer'
}
