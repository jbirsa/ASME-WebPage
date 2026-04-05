const FALLBACK_API_URL = "http://localhost:3000"

export function getBackendApiUrl(path: string) {
  const apiUrl = (process.env.API_URL || FALLBACK_API_URL).replace(/\/$/, "")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${apiUrl}${normalizedPath}`
}
