import { objectKeys } from '@okampus/shared/utils';

export const availableLocales = ['fr-FR', 'en-US'] as const;
export const fallbackLocale = 'fr-FR';
export const localePaths = { 'fr-FR': 'fr', 'en-US': 'en' } as const;

export type Locale = (typeof availableLocales)[number];
export type LocalePath = (typeof localePaths)[(typeof availableLocales)[number]];

export function getLocaleFromLocalePath(localePath: LocalePath) {
  return Object.entries(localePaths).find(([, path]) => path === localePath)?.[0] as Locale;
}

export const numberFormatters = {
  euro: { style: 'currency', currency: 'EUR' },
} as const;

export const byteFormatters = { byte: true } as const;

export const dateFormatters = {
  month: { month: 'long' },
  weekDay: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
  weekDayHour: { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: false },
  weekDayLong: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  weekDayLongHour: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  },
} as const;

export const dateRangeFormatters = {
  monthRange: { month: 'long' },
  dayRange: { day: 'numeric', month: 'short', year: 'numeric' },
  dayHourRange: { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: false },
} as const;

export const listFormatters = {
  conjunction: { type: 'conjunction' },
  disjunction: { type: 'disjunction' },
  unit: { type: 'unit' },
  list: { type: 'conjunction', style: 'narrow' },
  narrow: { type: 'unit', style: 'narrow' },
} as const;

export const relativeTimeFormatters = {
  relativeTimeLong: { numeric: 'auto', style: 'long' },
  relativeTimeShort: { numeric: 'auto', style: 'short' },
} as const;

export const pluralFormatters = {
  cardinal: { type: 'cardinal' },
  ordinal: { type: 'ordinal' },
} as const;

export type Formatters = {
  [key in keyof typeof byteFormatters]: { format: (value: number) => string };
} & {
  [key in keyof typeof numberFormatters]: { format: (value: number) => string };
} & {
  [key in keyof typeof dateFormatters]: { format: (value: Date) => string };
} & {
  [key in keyof typeof dateRangeFormatters]: { format: (value: [Date, Date]) => string };
} & {
  [key in keyof typeof listFormatters]: { format: (value: string[]) => string };
} & {
  [key in keyof typeof relativeTimeFormatters]: { format: (value: number) => string };
} & {
  [key in keyof typeof pluralFormatters]: { format: (value: number) => string };
};

export const allFormatters = [
  ...objectKeys(byteFormatters),
  ...objectKeys(numberFormatters),
  ...objectKeys(dateFormatters),
  ...objectKeys(dateRangeFormatters),
  ...objectKeys(listFormatters),
  ...objectKeys(relativeTimeFormatters),
  ...objectKeys(pluralFormatters),
] as const;

export type FormatKeys = (typeof allFormatters)[number];
export type FormatValueType<T extends FormatKeys> = T extends keyof typeof byteFormatters
  ? number
  : T extends keyof typeof numberFormatters
  ? number
  : T extends keyof typeof dateFormatters
  ? Date
  : T extends keyof typeof dateRangeFormatters
  ? [Date, Date]
  : T extends keyof typeof listFormatters
  ? string[]
  : T extends keyof typeof relativeTimeFormatters
  ? number
  : T extends keyof typeof pluralFormatters
  ? number
  : never;

export type Format = <T extends FormatKeys>(key: T, value: FormatValueType<T>) => string;

export const cutoffs = [60, 3600, 86_400, 86_400 * 7, 86_400 * 30, 86_400 * 365, Number.POSITIVE_INFINITY];
export const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
