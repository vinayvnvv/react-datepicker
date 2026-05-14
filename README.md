# @punaro/react-datepicker

A lightweight, accessible, and fully customizable React date picker component. Mobile-first, no calendar popup, and easy to style or theme.

---

## Features

- **Segmented input**: Day, month, year as separate fields (keyboard and mobile friendly)
- **No calendar popup**: Just type or pick from dropdowns
- **Dropdowns**: Optional, with custom icon support
- **Dark/light themes**: Built-in, or use your own
- **Outlined/flat/plain**: Choose your look
- **Full style control**: CSS file, slot-level class/style props, or zero-style mode
- **TypeScript**: Full types for all props and slots
- **Zero dependencies** (except `date-fns`)

---

## Installation

```bash
npm install @punaro/react-datepicker
```

## Usage

```tsx
import { useState } from "react";
import { DatePicker } from "@punaro/react-datepicker";
import "@punaro/react-datepicker/styles.css";

function App() {
  const [date, setDate] = useState<Date | undefined>();
  return <DatePicker value={date} onChange={setDate} />;
}
```

---

## Props

| Prop          | Type                                                    | Default        | Description                                                                |
| ------------- | ------------------------------------------------------- | -------------- | -------------------------------------------------------------------------- |
| value         | `Date \| undefined`                                     | —              | The selected date (controlled)                                             |
| onChange      | `(date: Date \| undefined) => void`                     | —              | Called when a valid date is entered/selected, or `undefined` if incomplete |
| dateFormat    | `string`                                                | `'dd/MM/yyyy'` | Format string using `dd`, `MM`, `yyyy` tokens (order/separator flexible)   |
| disabled      | `boolean`                                               | `false`        | Disables all inputs and dropdowns                                          |
| showDropdowns | `boolean`                                               | `false`        | Show dropdown icon next to each segment (native select for mobile/desktop) |
| dropdownIcon  | `ReactNode \| (segment: 'dd'\|'MM'\|'yyyy')=>ReactNode` | `'▾'`          | Custom icon for dropdown trigger (single or per-segment)                   |
| maxYear       | `number`                                                | current year   | Latest year in year dropdown                                               |
| yearRange     | `number`                                                | `100`          | How many years to show in year dropdown                                    |
| theme         | `'light' \| 'dark'`                                     | `'light'`      | Color theme (CSS variables, only if not `isPlainStyle`)                    |
| outlined      | `boolean`                                               | `false`        | Draw a single border around the whole component                            |
| isPlainStyle  | `boolean`                                               | `false`        | No built-in styles or classes; style from scratch                          |
| classNames    | `Partial<Record<StyleSlot, string>>`                    | —              | Add/override classes for any slot (see below)                              |
| styles        | `Partial<Record<StyleSlot, CSSProperties>>`             | —              | Add/override inline styles for any slot                                    |

### StyleSlot values

- `root`, `segment`, `input`, `separator`, `trigger`, `dropdownIcon`, `select`

---

## Examples

### Basic

```tsx
<DatePicker value={date} onChange={setDate} />
```

### Custom format

```tsx
<DatePicker value={date} onChange={setDate} dateFormat="MM-yyyy-dd" />
```

### With dropdowns

```tsx
<DatePicker value={date} onChange={setDate} showDropdowns />
```

### Custom dropdown icon (emoji)

```tsx
<DatePicker value={date} onChange={setDate} showDropdowns dropdownIcon="📅" />
```

### Custom dropdown icon (SVG)

```tsx
<DatePicker
  value={date}
  onChange={setDate}
  showDropdowns
  dropdownIcon={
    <svg width="10" height="10" viewBox="0 0 10 10">
      <path
        d="M1 3l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  }
/>
```

### Per-segment dropdown icon

```tsx
<DatePicker
  value={date}
  onChange={setDate}
  showDropdowns
  dropdownIcon={(seg) => (seg === "dd" ? "📆" : seg === "MM" ? "🗓️" : "⏳")}
/>
```

### Outlined (single-field look)

```tsx
<DatePicker value={date} onChange={setDate} showDropdowns outlined />
```

### Dark theme

```tsx
<DatePicker
  value={date}
  onChange={setDate}
  showDropdowns
  outlined
  theme="dark"
/>
```

### Plain (no styles)

```tsx
<DatePicker value={date} onChange={setDate} showDropdowns isPlainStyle />
```

### Custom styles via classNames/styles

```tsx
<DatePicker
  value={date}
  onChange={setDate}
  showDropdowns
  outlined
  classNames={{
    root: "custom-root",
    input: "custom-input",
    dropdownIcon: "custom-icon",
    trigger: "custom-trigger",
    segment: "custom-segment",
    separator: "custom-sep",
    select: "custom-select",
  }}
  styles={{
    root: { background: "#f0f9ff", borderColor: "#38bdf8" },
    input: { color: "#0ea5e9", fontWeight: 600 },
    dropdownIcon: { color: "#0ea5e9", fontSize: 16 },
    trigger: { background: "#bae6fd" },
    segment: { marginRight: 2 },
    separator: { color: "#38bdf8" },
    select: { minWidth: 24 },
  }}
/>
```

---

## Theming & Styling

- Import the CSS file for default styles:
  ```js
  import "@punaro/react-datepicker/styles.css";
  ```
- Use the `theme` prop for dark/light, or override CSS variables on `.rdp-root` for custom themes.
- Use `classNames`/`styles` for slot-level overrides.
- Use `isPlainStyle` for zero-style mode (all classes/inline styles removed).

## License

MIT
