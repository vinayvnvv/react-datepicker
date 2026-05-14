import { isValid } from 'date-fns'
import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { parseFormat } from './utils/format'
import { pad } from './utils/string'
import { fromDate, maxDay, toDate } from './utils/time'
import { LABEL, PLACEHOLDER } from './utils/constants'
import type { SegmentKey, Token, Values } from './types'

export interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  /** Format using `dd`, `MM`, `yyyy` tokens. Defaults to `dd/MM/yyyy`. */
  dateFormat?: string
  disabled?: boolean
  name?: string
  id?: string
  'aria-label'?: string
  /** When true, render a native `<select>` dropdown next to each segment. */
  showDropdowns?: boolean
  /** Latest selectable year in the year dropdown. Defaults to the current year. */
  maxYear?: number
  /** How many years to include in the year dropdown (descending from `maxYear`). Defaults to 100. */
  yearRange?: number
  /**
   * Custom dropdown trigger icon. Either a single node used for every segment,
   * or a render function that receives the segment key. Defaults to a chevron.
   * Only used when `showDropdowns` is true.
   */
  dropdownIcon?: ReactNode | ((segment: SegmentKey) => ReactNode)
  /** Color theme. Defaults to `'light'`. Ignored when `isPlainStyle` is true. */
  theme?: 'light' | 'dark'
  /** When true, draw a single border around the whole component. Defaults to false. */
  outlined?: boolean
  /** When true, no styles or class names are applied. Use this if you want to style from scratch. */
  isPlainStyle?: boolean
  /** Per-slot class names. Merged after the built-in `rdp-*` classes (or used alone in plain mode). */
  classNames?: Partial<Record<StyleSlot, string>>
  /** Per-slot inline styles. Merged on top of the component's own inline styles. */
  styles?: Partial<Record<StyleSlot, CSSProperties>>
}

/** Style slots a consumer can target via `classNames` / `styles` props. */
export type StyleSlot =
  | 'root'
  | 'segment'
  | 'input'
  | 'separator'
  | 'trigger'
  | 'dropdownIcon'
  | 'select'

export function DatePicker({
  value,
  onChange,
  dateFormat = 'dd/MM/yyyy',
  disabled = false,
  name,
  id,
  showDropdowns = false,
  maxYear,
  yearRange = 100,
  dropdownIcon,
  theme = 'light',
  outlined = false,
  isPlainStyle = false,
  classNames,
  styles: slotStyles,
  ...rest
}: DatePickerProps) {
  const resolvedMaxYear = maxYear ?? new Date().getFullYear()
  const tokens = useMemo(() => parseFormat(dateFormat), [dateFormat])
  const fieldKeys = useMemo(
    () =>
      tokens
        .filter((t): t is Extract<Token, { type: 'field' }> => t.type === 'field')
        .map((t) => t.key),
    [tokens],
  )

  const [values, setValues] = useState<Values>(() => fromDate(value))
  const refs = useRef<Record<SegmentKey, HTMLInputElement | null>>({
    dd: null,
    MM: null,
    yyyy: null,
  })

  // Tracks the last value we emitted to the parent. Used to ignore the
  // controlled-parent's echo (which would otherwise overwrite an in-progress
  // partial edit, e.g. clearing one digit of the year).
  const lastEmittedTime = useRef<number | undefined>(
    value && isValid(value) ? value.getTime() : undefined,
  )

  // Sync from external value changes only when the incoming value is
  // genuinely different from what this component last emitted.
  const valueTime = value && isValid(value) ? value.getTime() : undefined
  useEffect(() => {
    if (valueTime === lastEmittedTime.current) return
    lastEmittedTime.current = valueTime
    setValues(fromDate(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueTime])

  function emit(next: Values) {
    const date = toDate(next)
    if (date) {
      lastEmittedTime.current = date.getTime()
      onChange?.(date)
      return
    }
    lastEmittedTime.current = undefined
    onChange?.(undefined)
  }

  function focusSibling(current: SegmentKey, dir: 1 | -1) {
    const idx = fieldKeys.indexOf(current)
    const target = fieldKeys[idx + dir]
    if (!target) return
    const el = refs.current[target]
    if (!el) return
    el.focus()
    if (dir === -1) {
      const len = el.value.length
      try {
        el.setSelectionRange(len, len)
      } catch {
        /* some input types don't support selection */
      }
    } else {
      try {
        el.setSelectionRange(0, el.value.length)
      } catch {
        /* noop */
      }
    }
  }

  function handleChange(key: SegmentKey, raw: string, maxLen: number) {
    // Strip non-digits and clamp length
    const digits = raw.replace(/\D/g, '').slice(0, maxLen)

    setValues((prev) => {
      const next: Values = { ...prev, [key]: digits }

      if (digits.length > 0) {
        const num = parseInt(digits, 10)

        // Reject impossible first digits (so user can't even type 4-9 as first dd digit, etc.)
        if (digits.length < maxLen) {
          if (key === 'dd' && parseInt(digits[0]!, 10) > 3) return prev
          if (key === 'MM' && parseInt(digits[0]!, 10) > 1) return prev
        }

        // Reject full segments that exceed allowed range
        if (digits.length === maxLen) {
          if (key === 'dd' && (num < 1 || num > maxDay(next.MM, next.yyyy))) return prev
          if (key === 'MM' && (num < 1 || num > 12)) return prev
          if (key === 'yyyy' && num < 1) return prev
        }
      }

      // If month or year changed, ensure existing day is still valid; clear it otherwise.
      if (key !== 'dd' && next.dd.length === 2) {
        const dnum = parseInt(next.dd, 10)
        if (dnum > maxDay(next.MM, next.yyyy)) next.dd = ''
      }

      // Auto-advance once segment is full
      if (digits.length === maxLen) {
        queueMicrotask(() => focusSibling(key, 1))
      }

      emit(next)
      return next
    })
  }

  function getOptions(key: SegmentKey): string[] {
    if (key === 'dd') {
      const max = maxDay(values.MM, values.yyyy)
      return Array.from({ length: max }, (_, i) => pad(i + 1, 2))
    }
    if (key === 'MM') {
      return Array.from({ length: 12 }, (_, i) => pad(i + 1, 2))
    }
    // yyyy: descending from resolvedMaxYear
    return Array.from({ length: yearRange }, (_, i) => pad(resolvedMaxYear - i, 4))
  }

  function handleSelect(key: SegmentKey, raw: string, maxLen: 2 | 4) {
    // Route through handleChange so all validation + day re-check + emit happens.
    handleChange(key, raw, maxLen)
  }

  function handleKeyDown(key: SegmentKey, e: KeyboardEvent<HTMLInputElement>) {
    const target = e.currentTarget
    const atStart = target.selectionStart === 0 && target.selectionEnd === 0
    const atEnd =
      target.selectionStart === target.value.length &&
      target.selectionEnd === target.value.length

    if (e.key === 'Backspace' && target.value === '') {
      e.preventDefault()
      focusSibling(key, -1)
      return
    }
    if (e.key === 'ArrowLeft' && atStart) {
      e.preventDefault()
      focusSibling(key, -1)
      return
    }
    if (e.key === 'ArrowRight' && atEnd) {
      e.preventDefault()
      focusSibling(key, 1)
    }
  }

  // Inline styles only used in plain mode. The CSS file (when not plain)
  // handles layout via .rdp-* classes; the absolute positioning of the
  // invisible <select> over the icon is functional, not cosmetic, so it
  // must always be applied.
  const triggerStyle = isPlainStyle
    ? {
        position: 'relative' as const,
        display: 'inline-flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        width: '1em',
        height: '1em',
        cursor: disabled ? ('not-allowed' as const) : ('pointer' as const),
        userSelect: 'none' as const,
        lineHeight: 1,
      }
    : { position: 'relative' as const }

  const selectStyle = {
    position: 'absolute' as const,
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: disabled ? ('not-allowed' as const) : ('pointer' as const),
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    MozAppearance: 'none' as const,
    border: 0,
    padding: 0,
    margin: 0,
    background: 'transparent',
    color: 'transparent',
    fontSize: 'inherit',
  }

  const segmentStyle = isPlainStyle
    ? { display: 'inline-flex' as const, alignItems: 'center' as const }
    : undefined

  // Helper: combine the built-in class for a slot with any consumer-provided class.
  const cn = (builtin: string | undefined, slot: StyleSlot) => {
    const extra = classNames?.[slot]
    if (!builtin) return extra
    return extra ? `${builtin} ${extra}` : builtin
  }

  // Helper: merge built-in inline style with consumer slot style (consumer wins).
  const mergeStyle = (
    base: CSSProperties | undefined,
    slot: StyleSlot,
  ): CSSProperties | undefined => {
    const extra = slotStyles?.[slot]
    if (!base) return extra
    if (!extra) return base
    return { ...base, ...extra }
  }

  return (
    <span
      role="group"
      aria-label={rest['aria-label'] ?? 'Date'}
      id={id}
      className={cn(isPlainStyle ? undefined : 'rdp-root', 'root')}
      style={mergeStyle(undefined, 'root')}
      data-theme={isPlainStyle ? undefined : theme}
      data-outlined={isPlainStyle ? undefined : outlined ? 'true' : 'false'}
      data-disabled={isPlainStyle ? undefined : disabled ? 'true' : 'false'}
    >
      {tokens.map((t, i) => {
        if (t.type === 'sep') {
          return (
            <span
              key={`s${i}`}
              aria-hidden="true"
              className={cn(isPlainStyle ? undefined : 'rdp-sep', 'separator')}
              style={mergeStyle(undefined, 'separator')}
            >
              {t.value}
            </span>
          )
        }
        return (
          <span
            key={t.key}
            className={cn(isPlainStyle ? undefined : 'rdp-segment', 'segment')}
            style={mergeStyle(segmentStyle, 'segment')}
          >
              <input
                ref={(el) => {
                  refs.current[t.key] = el
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                disabled={disabled}
                name={name ? `${name}-${t.key}` : undefined}
                maxLength={t.length}
                size={t.length}
                placeholder={PLACEHOLDER[t.key]}
                aria-label={LABEL[t.key]}
                className={cn(isPlainStyle ? undefined : 'rdp-input', 'input')}
                style={mergeStyle(undefined, 'input')}
                value={values[t.key]}
                data-segment={t.key}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(t.key, e.target.value, t.length)
                }
                onKeyDown={(e) => handleKeyDown(t.key, e)}
                onFocus={(e) => e.currentTarget.select()}
              />
            {showDropdowns && (
              <span
                className={cn(isPlainStyle ? undefined : 'rdp-trigger', 'trigger')}
                style={mergeStyle(triggerStyle, 'trigger')}
              >
                <span
                  aria-hidden="true"
                  className={cn(undefined, 'dropdownIcon')}
                  style={mergeStyle(undefined, 'dropdownIcon')}
                >
                  {typeof dropdownIcon === 'function'
                    ? dropdownIcon(t.key)
                    : (dropdownIcon ?? '▾')}
                </span>
                <select
                  aria-label={`Pick ${LABEL[t.key]}`}
                  disabled={disabled}
                  className={cn(isPlainStyle ? undefined : 'rdp-select', 'select')}
                  value={values[t.key]}
                  onChange={(e) => handleSelect(t.key, e.target.value, t.length)}
                  style={mergeStyle(selectStyle, 'select')}
                >
                  <option value="" disabled hidden>
                    {LABEL[t.key]}
                  </option>
                  {getOptions(t.key).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
