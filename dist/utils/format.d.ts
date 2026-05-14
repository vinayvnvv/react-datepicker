import { Token } from '../types';
/**
 * Parse a date format string (e.g. `dd/MM/yyyy`) into an ordered list of
 * field and separator tokens. Recognized field tokens: `dd`, `MM`, `yyyy`.
 */
export declare function parseFormat(format: string): Token[];
