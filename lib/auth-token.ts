const TOKEN_KEY = "asme_access_token"
export const AUTH_TOKEN_CHANGED_EVENT = "asme-auth-token-changed"

export type AuthTokenPayload = {
  sub?: string
  email?: string
  rol?: string
  exp?: number
  iat?: number
}

function emitAuthTokenChanged() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGED_EVENT))
}

function decodeBase64Url(value: string) {
  if (typeof window === "undefined" || typeof window.atob !== "function") return null

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")

  try {
    return window.atob(padded)
  } catch {
    return null
  }
}

export function parseAuthTokenPayload(token: string | null) {
  if (!token) return null

  const [, payload] = token.split(".")
  if (!payload) return null

  const decodedPayload = decodeBase64Url(payload)
  if (!decodedPayload) return null

  try {
    return JSON.parse(decodedPayload) as AuthTokenPayload
  } catch {
    return null
  }
}

export function getAuthToken() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function getAuthTokenPayload() {
  return parseAuthTokenPayload(getAuthToken())
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
  emitAuthTokenChanged()
}

export function clearAuthToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
  emitAuthTokenChanged()
}
