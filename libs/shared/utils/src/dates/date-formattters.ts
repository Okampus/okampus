// TODO: simplify, generalize

const fmtShort = Intl.DateTimeFormat('fr', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
});

const fmtStandard = Intl.DateTimeFormat('fr', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});

const fmtSimple = Intl.DateTimeFormat('fr', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const getDate = (date?: string | Date): Date => {
  if (!date) return new Date();
  if (typeof date === 'string') return new Date(date);
  return date;
};

export const getDay = (date: string | Date): number => getDate(date).getDate();

export const getMonthShort = (date: string | Date): string =>
  Intl.DateTimeFormat('fr', { month: 'short' }).format(getDate(date));

export const getMonthLong = (date: string | Date): string =>
  Intl.DateTimeFormat('fr', { month: 'long' }).format(getDate(date));

export function formatDateDayOfWeek(date: string | Date): string {
  date = getDate(date);
  return fmtShort.format(date);
}

export function formatDateStandard(date: string | Date): string {
  date = getDate(date);
  return fmtStandard.format(date);
}

export function formatDateSimple(date: string | Date): string {
  date = getDate(date);
  const currentYear = new Date().getFullYear();
  if (date.getFullYear() === currentYear) return fmtSimple.format(date).replace(currentYear.toString(), '');
  return fmtSimple.format(date);
}

export function formatDateRangeDayOfWeek(date1: string | Date, date2: string | Date): string {
  date1 = getDate(date1);
  date2 = getDate(date2);

  return fmtShort.formatRange(date1, date2);
}

export function formatDateRangeStandard(date1: string | Date, date2: string | Date): string {
  date1 = getDate(date1);
  date2 = getDate(date2);

  return fmtStandard.formatRange(date1, date2);
}

export function formatDateRangeSimple(date1: string | Date, date2: string | Date): string {
  date1 = getDate(date1);
  date2 = getDate(date2);
  const currentYear = new Date().getFullYear();

  if (date1.getFullYear() === currentYear && date2.getFullYear() === currentYear)
    return fmtSimple.formatRange(date1, date2).replace(currentYear.toString(), '');
  return fmtSimple.formatRange(date1, date2);
}
