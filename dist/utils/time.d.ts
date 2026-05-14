import { Values } from '../types';
/** Build segment values from a `Date`. Returns empty values for invalid input. */
export declare function fromDate(date: Date | undefined): Values;
/**
 * Maximum allowed day for a given month/year segment context.
 * Falls back to a leap-safe year (2000) when the year is unknown so that
 * Feb 29 is initially permitted and re-validated once the year is provided.
 */
export declare function maxDay(monthStr: string, yearStr: string): number;
/**
 * Build a `Date` from segment values if and only if they form a valid
 * calendar date. Returns `undefined` for partial or invalid values
 * (e.g. 31/02/2024).
 */
export declare function toDate(values: Values): Date | undefined;
