import { objectKeys } from '@okampus/shared/utils';

export const availableLocales = ['fr-FR', 'en-US'] as const;
export const fallbackBaseLocales = { fr: 'fr-FR', en: 'en-US' } as const;
export const fallbackLocale = 'fr-FR';

export const numberFormatters = {
  euro: { style: 'currency', currency: 'EUR' },
} as const;

export const dateFormatters = {
  month: { month: 'long' },
  weekDay: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
  weekDayHour: { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: false },
} as const;

export const listFormatters = {
  conjunction: { type: 'conjunction' },
  disjunction: { type: 'disjunction' },
  unit: { type: 'unit' },
  list: { type: 'conjunction', style: 'narrow' },
  narrow: { type: 'unit', style: 'narrow' },
} as const;

export const timeFormatters = {
  long: { numeric: 'auto', style: 'long' },
  short: { numeric: 'auto', style: 'short' },
} as const;

export const pluralFormatters = {
  cardinal: { type: 'cardinal' },
  ordinal: { type: 'ordinal' },
} as const;

export type Formatters = {
  [key in keyof typeof numberFormatters]: { format: (value: number) => string };
} & {
  [key in keyof typeof dateFormatters]: { format: (value: Date) => string };
} & {
  [key in keyof typeof listFormatters]: { format: (value: string[]) => string };
} & {
  [key in keyof typeof timeFormatters]: { format: (value: number) => string };
} & {
  [key in keyof typeof pluralFormatters]: { format: (value: number) => string };
};

export const allFormatters = [
  ...objectKeys(numberFormatters),
  ...objectKeys(dateFormatters),
  ...objectKeys(listFormatters),
  ...objectKeys(timeFormatters),
  ...objectKeys(pluralFormatters),
] as const;

export type FormatValueType<T extends typeof allFormatters[number]> = T extends keyof typeof numberFormatters
  ? number
  : T extends keyof typeof dateFormatters
  ? Date
  : T extends keyof typeof listFormatters
  ? string[]
  : T extends keyof typeof timeFormatters
  ? number
  : T extends keyof typeof pluralFormatters
  ? number
  : never;

export type Format = <T extends typeof allFormatters[number]>(key: T, value: FormatValueType<T>) => string;

export const cutoffs = [60, 3600, 86_400, 86_400 * 7, 86_400 * 30, 86_400 * 365, Number.POSITIVE_INFINITY];
export const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
