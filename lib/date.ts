export const parseEventDate = (dateValue: string | Date) => {
  if (dateValue instanceof Date) {
    return new Date(dateValue.getTime())
  }

  if (typeof dateValue === "string") {
    const hasTimeInformation = dateValue.includes("T") || dateValue.includes(" ")

    if (!hasTimeInformation) {
      const segments = dateValue.split("-").map((segment) => Number.parseInt(segment, 10))

      if (segments.length === 3 && segments.every((segment) => Number.isFinite(segment))) {
        const [year, month, day] = segments
        return new Date(year, month - 1, day)
      }
    }

    const fallbackDate = new Date(dateValue)
    if (!Number.isNaN(fallbackDate.getTime())) {
      return fallbackDate
    }
  }

  return new Date(NaN)
}

export const formatEventDate = (
  dateValue: string | Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
) => {
  const date = parseEventDate(dateValue)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toLocaleDateString(locale, options)
}
