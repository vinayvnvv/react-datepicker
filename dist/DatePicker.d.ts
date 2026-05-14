import { CSSProperties, ReactNode } from 'react';
import { SegmentKey } from './types';
export interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    /** Format using `dd`, `MM`, `yyyy` tokens. Defaults to `dd/MM/yyyy`. */
    dateFormat?: string;
    disabled?: boolean;
    name?: string;
    id?: string;
    'aria-label'?: string;
    /** When true, render a native `<select>` dropdown next to each segment. */
    showDropdowns?: boolean;
    /** Latest selectable year in the year dropdown. Defaults to the current year. */
    maxYear?: number;
    /** How many years to include in the year dropdown (descending from `maxYear`). Defaults to 100. */
    yearRange?: number;
    /**
     * Custom dropdown trigger icon. Either a single node used for every segment,
     * or a render function that receives the segment key. Defaults to a chevron.
     * Only used when `showDropdowns` is true.
     */
    dropdownIcon?: ReactNode | ((segment: SegmentKey) => ReactNode);
    /** Color theme. Defaults to `'light'`. Ignored when `isPlainStyle` is true. */
    theme?: 'light' | 'dark';
    /** When true, draw a single border around the whole component. Defaults to false. */
    outlined?: boolean;
    /** When true, no styles or class names are applied. Use this if you want to style from scratch. */
    isPlainStyle?: boolean;
    /** Per-slot class names. Merged after the built-in `rdp-*` classes (or used alone in plain mode). */
    classNames?: Partial<Record<StyleSlot, string>>;
    /** Per-slot inline styles. Merged on top of the component's own inline styles. */
    styles?: Partial<Record<StyleSlot, CSSProperties>>;
}
/** Style slots a consumer can target via `classNames` / `styles` props. */
export type StyleSlot = 'root' | 'segment' | 'input' | 'separator' | 'trigger' | 'dropdownIcon' | 'select';
export declare function DatePicker({ value, onChange, dateFormat, disabled, name, id, showDropdowns, maxYear, yearRange, dropdownIcon, theme, outlined, isPlainStyle, classNames, styles: slotStyles, ...rest }: DatePickerProps): import("react/jsx-runtime").JSX.Element;
