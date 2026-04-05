import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function isMacOs() {
  if (typeof window === 'undefined') return false

  return window.navigator.userAgent.includes('Mac')
}
