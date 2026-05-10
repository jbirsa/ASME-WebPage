import { getEventDetailsHref } from "@/lib/events"
import { getSafeHttpUrl } from "@/lib/safe-url"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function trimSingleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim()
}

export function trimMultiline(value: string) {
  return value.trim()
}

export function normalizeEmailInput(value: string) {
  return trimSingleLine(value).toLowerCase()
}

export function isValidEmailInput(value: string) {
  return emailRegex.test(normalizeEmailInput(value))
}

export function isValidHttpUrlInput(value: string) {
  return Boolean(getSafeHttpUrl(trimSingleLine(value)))
}

export function isValidEventPageInput(value: string) {
  return Boolean(getEventDetailsHref(trimSingleLine(value)))
}
