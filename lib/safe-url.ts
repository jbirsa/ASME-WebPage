export function getSafeHttpUrl(value?: string | null) {
  if (!value) return null

  try {
    const url = new URL(value)
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString()
    }
  } catch {
    return null
  }

  return null
}

export function getSafeImageSrc(value?: string | null) {
  if (!value) return null

  const trimmedValue = value.trim()
  if (!trimmedValue) return null
  if (trimmedValue.startsWith("/")) return trimmedValue

  return getSafeHttpUrl(trimmedValue)
}

export function getSafeMailtoHref(value?: string | null) {
  if (!value) return null

  const trimmedValue = value.trim()
  if (!trimmedValue) return null

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(trimmedValue)) return null

  return `mailto:${trimmedValue}`
}
