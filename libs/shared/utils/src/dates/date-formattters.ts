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

const getDate = (date?: string | Date): Date => {
  if (!date) return new Date();
  if (typeof date === 'string') return new Date(date);
  return date;
};

export function formatDateDayOfWeek(date: string | Date): string {
  date = getDate(date);
  return fmtShort.format(date);
}

export function formatDateStandard(date: string | Date): string {
  date = getDate(date);
  return fmtStandard.format(date);
}

export function formatDateRange(date1: string | Date, date2: string | Date): string {
  date1 = getDate(date1);
  date2 = getDate(date2);

  return fmtShort.formatRange(date1, date2);
}
