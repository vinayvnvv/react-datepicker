import type { SegmentKey, Values } from '../types'

export const PLACEHOLDER: Record<SegmentKey, string> = {
  dd: 'DD',
  MM: 'MM',
  yyyy: 'YYYY',
}

export const LABEL: Record<SegmentKey, string> = {
  dd: 'Day',
  MM: 'Month',
  yyyy: 'Year',
}

export const EMPTY: Values = { dd: '', MM: '', yyyy: '' }
