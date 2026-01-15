import { format, isAfter, subWeeks } from 'date-fns'

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return ''

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date))
  } catch (_err) {
    return ''
  }
}

export function formatSignInDate(lastSignInTimestamp?: number | null) {
  if (!lastSignInTimestamp) return ''

  // Convert the timestamp to a Date object
  const lastSignInDate = new Date(lastSignInTimestamp)
  const currentDate = new Date()

  // Check if the last sign-in is over a week old
  const isNotOverAWeek = isAfter(lastSignInDate, subWeeks(currentDate, 1))

  // Format the date accordingly
  let formattedDate

  if (isNotOverAWeek) {
    formattedDate = format(lastSignInDate, "'Last' eeee 'at' h:mm a")
  } else {
    formattedDate = format(lastSignInDate, 'MM/dd/yyyy')
  }

  return formattedDate
}
