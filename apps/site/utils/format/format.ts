import type { Locale } from '../../server/ssr/getLang';
import type { Currency } from '@prisma/client';

export const numberFormatters = { decimal: { minimumFractionDigits: 2, maximumFractionDigits: 2 } } as const;
export const getCurrencyFormatter = (currency: Currency) => ({ style: 'currency', currency }) as const;

export const dateFormatters = {
  month: { month: 'long' },
  day: { day: 'numeric', month: 'long', year: 'numeric' },
  dayShort: { day: '2-digit', month: 'short', year: 'numeric' },
  weekDay: { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' },
  weekDayHour: { weekday: 'short', day: '2-digit', month: 'short', hour: 'numeric', minute: 'numeric', hour12: false },
  weekDayLong: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' },
  weekDayLongHour: {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  },
} as const;

const dayRange = { day: 'numeric', month: 'short', year: 'numeric' } as const;
const dayHourRange = { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: false } as const;
export const dateRangeFormatters: Record<Locale, Record<'dayRange' | 'dayHourRange', Intl.DateTimeFormat>> = {
  'en-US': {
    dayRange: new Intl.DateTimeFormat('en-US', dayRange),
    dayHourRange: new Intl.DateTimeFormat('en-US', dayHourRange),
  },
  'fr-FR': {
    dayRange: new Intl.DateTimeFormat('fr-FR', dayRange),
    dayHourRange: new Intl.DateTimeFormat('fr-FR', dayHourRange),
  },
};

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
