/** Left-pad a number to the given length with leading zeroes. */
export function pad(n: number, len: number): string {
  return String(n).padStart(len, '0')
}
