import { getDaysInMonth, isValid } from 'date-fns'
import { pad } from './string'
import { EMPTY } from './constants'
import type { Values } from '../types'

/** Build segment values from a `Date`. Returns empty values for invalid input. */
export function fromDate(date: Date | undefined): Values {
  if (!date || !isValid(date)) return EMPTY
  return {
    dd: pad(date.getDate(), 2),
    MM: pad(date.getMonth() + 1, 2),
    yyyy: pad(date.getFullYear(), 4),
  }
}

/**
 * Maximum allowed day for a given month/year segment context.
 * Falls back to a leap-safe year (2000) when the year is unknown so that
 * Feb 29 is initially permitted and re-validated once the year is provided.
 */
export function maxDay(monthStr: string, yearStr: string): number {
  const m = parseInt(monthStr, 10)
  if (!m || m < 1 || m > 12) return 31
  const y = yearStr.length === 4 ? parseInt(yearStr, 10) : 2000
  return getDaysInMonth(new Date(y, m - 1, 1))
}

/**
 * Build a `Date` from segment values if and only if they form a valid
 * calendar date. Returns `undefined` for partial or invalid values
 * (e.g. 31/02/2024).
 */
export function toDate(values: Values): Date | undefined {
  if (values.dd.length !== 2 || values.MM.length !== 2 || values.yyyy.length !== 4) {
    return undefined
  }
  const d = parseInt(values.dd, 10)
  const m = parseInt(values.MM, 10)
  const y = parseInt(values.yyyy, 10)
  const date = new Date(y, m - 1, d)
  if (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  ) {
    return date
  }
  return undefined
}
