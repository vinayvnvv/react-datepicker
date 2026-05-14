import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { DatePicker } from '../src'
import type { SegmentKey } from '../src/types'
import '../src/styles.css'

function ExampleSection({ title, description, code, children }: { title: string, description?: string, code: string, children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, marginBottom: 4 }}>{title}</h2>
      {description && <p style={{ color: '#555', margin: '4px 0 8px 0' }}>{description}</p>}
      <div style={{ marginBottom: 8 }}>{children}</div>
      <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, fontSize: 13, overflowX: 'auto' }}>
        <code>{code}</code>
      </pre>
    </section>
  )
}

function App() {
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 32, maxWidth: 700 }}>
      <h1>@punaro/react-datepicker — Live Playground</h1>
      <p>Try all features and see code for each scenario. <br />
        <b>Selected date:</b> <code>{date ? date.toISOString() : 'none'}</code>
      </p>

      <ExampleSection
        title="Basic usage"
        description="The simplest controlled usage."
        code={`<DatePicker value={date} onChange={setDate} />`}
      >
        <DatePicker value={date} onChange={setDate} />
      </ExampleSection>

      <ExampleSection
        title="Custom format (MM-yyyy-dd)"
        description="Change the order and separator of segments."
        code={`<DatePicker value={date} onChange={setDate} dateFormat="MM-yyyy-dd" />`}
      >
        <DatePicker value={date} onChange={setDate} dateFormat="MM-yyyy-dd" />
      </ExampleSection>

      <ExampleSection
        title="Dropdowns for all segments"
        description="Show native dropdowns for day, month, and year."
        code={`<DatePicker value={date} onChange={setDate} showDropdowns />`}
      >
        <DatePicker value={date} onChange={setDate} showDropdowns />
      </ExampleSection>

      <ExampleSection
        title="Custom dropdown icon (emoji)"
        description="Use an emoji as the dropdown icon."
        code={`<DatePicker value={date} onChange={setDate} showDropdowns dropdownIcon="📅" />`}
      >
        <DatePicker value={date} onChange={setDate} showDropdowns dropdownIcon="📅" />
      </ExampleSection>

      <ExampleSection
        title="Custom dropdown icon (SVG)"
        description="Use an inline SVG as the dropdown icon."
        code={`<DatePicker value={date} onChange={setDate} showDropdowns dropdownIcon={<svg ... />} />`}
      >
        <DatePicker
          value={date}
          onChange={setDate}
          showDropdowns
          dropdownIcon={
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </ExampleSection>

      <ExampleSection
        title="Custom dropdown icon (per segment)"
        description="Use a different icon for each segment."
        code={`<DatePicker value={date} onChange={setDate} showDropdowns dropdownIcon={seg => seg === 'dd' ? '📆' : seg === 'MM' ? '🗓️' : '⏳'} />`}
      >
        <DatePicker
          value={date}
          onChange={setDate}
          showDropdowns
          dropdownIcon={(seg: SegmentKey) => seg === 'dd' ? '📆' : seg === 'MM' ? '🗓️' : '⏳'}
        />
      </ExampleSection>

      <ExampleSection
        title="Outlined (single-field look)"
        description="Show a single border around the component."
        code={`<DatePicker value={date} onChange={setDate} showDropdowns outlined />`}
      >
        <DatePicker value={date} onChange={setDate} showDropdowns outlined />
      </ExampleSection>

      <ExampleSection
        title="Dark theme"
        description="Switch to dark mode with the theme prop."
        code={`<DatePicker value={date} onChange={setDate} showDropdowns outlined theme="dark" />`}
      >
        <div style={{ background: '#0b1220', padding: 16, borderRadius: 8 }}>
          <DatePicker value={date} onChange={setDate} showDropdowns outlined theme="dark" />
        </div>
      </ExampleSection>

      <ExampleSection
        title="Plain mode (no styles)"
        description="Remove all built-in styles and classes."
        code={`<DatePicker value={date} onChange={setDate} showDropdowns isPlainStyle />`}
      >
        <DatePicker value={date} onChange={setDate} showDropdowns isPlainStyle />
      </ExampleSection>

      <ExampleSection
        title="Disabled state"
        description="Disable all inputs and dropdowns."
        code={`<DatePicker value={date} onChange={setDate} disabled outlined />`}
      >
        <DatePicker value={date} onChange={setDate} disabled outlined />
      </ExampleSection>

      <ExampleSection
        title="Custom styles via classNames/styles"
        description="Override styles and classes for every slot."
        code={`<DatePicker value={date} onChange={setDate} showDropdowns outlined classNames={{ root: 'custom-root', ... }} styles={{ root: { background: '#f0f9ff' }, ... }} />`}
      >
        <DatePicker
          value={date}
          onChange={setDate}
          showDropdowns
          outlined
          classNames={{
            root: 'custom-root',
            input: 'custom-input',
            dropdownIcon: 'custom-icon',
            trigger: 'custom-trigger',
            segment: 'custom-segment',
            separator: 'custom-sep',
            select: 'custom-select',
          }}
          styles={{
            root: { background: '#f0f9ff', borderColor: '#38bdf8' },
            input: { color: '#0ea5e9', fontWeight: 600 },
            dropdownIcon: { color: '#0ea5e9', fontSize: 16 },
            trigger: { background: '#bae6fd' },
            segment: { marginRight: 2 },
            separator: { color: '#38bdf8' },
            select: { minWidth: 24 },
          }}
        />
      </ExampleSection>

      <ExampleSection
        title="All props demo"
        description="Show all props in action."
        code={`<DatePicker
  value={date}
  onChange={setDate}
  dateFormat="yyyy-MM-dd"
  showDropdowns
  dropdownIcon={seg => seg === 'dd' ? '📆' : seg === 'MM' ? '🗓️' : '⏳'}
  maxYear={2030}
  yearRange={50}
  theme="dark"
  outlined
  classNames={{ root: 'custom-root' }}
  styles={{ root: { background: '#222', color: '#fff' } }}
/>`}
      >
        <div style={{ background: '#222', padding: 16, borderRadius: 8 }}>
          <DatePicker
            value={date}
            onChange={setDate}
            dateFormat="yyyy-MM-dd"
            showDropdowns
            dropdownIcon={(seg: SegmentKey) => seg === 'dd' ? '📆' : seg === 'MM' ? '🗓️' : '⏳'}
            maxYear={2030}
            yearRange={50}
            theme="dark"
            outlined
            classNames={{ root: 'custom-root' }}
            styles={{ root: { background: '#222', color: '#fff' } }}
          />
        </div>
      </ExampleSection>

      <footer style={{ marginTop: 48, color: '#888', fontSize: 13 }}>
        <div>MIT Licensed. Source: <a href="https://github.com/punaro/react-datepicker" target="_blank" rel="noopener noreferrer">GitHub</a></div>
        <div>See <a href="https://www.npmjs.com/package/@punaro/react-datepicker" target="_blank" rel="noopener noreferrer">npm</a> for install instructions.</div>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
