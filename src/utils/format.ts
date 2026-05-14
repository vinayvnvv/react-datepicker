import type { SegmentKey, Token } from '../types'

/**
 * Parse a date format string (e.g. `dd/MM/yyyy`) into an ordered list of
 * field and separator tokens. Recognized field tokens: `dd`, `MM`, `yyyy`.
 */
export function parseFormat(format: string): Token[] {
  const re = /(dd|MM|yyyy)/g
  const tokens: Token[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(format)) !== null) {
    if (m.index > last) {
      tokens.push({ type: 'sep', value: format.slice(last, m.index) })
    }
    const key = m[1] as SegmentKey
    tokens.push({ type: 'field', key, length: key === 'yyyy' ? 4 : 2 })
    last = m.index + m[1].length
  }
  if (last < format.length) {
    tokens.push({ type: 'sep', value: format.slice(last) })
  }
  return tokens
}
