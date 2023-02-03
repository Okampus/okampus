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

export function formatDateDayOfWeek(date: string | Date): string {
  date = new Date(date);
  return fmtShort.format(date);
}

export function formatDateStandard(date: string | Date): string {
  date = new Date(date);
  return fmtStandard.format(date);
}

export function formatDateRange(date1: string | Date, date2: string | Date): string {
  date1 = new Date(date1);
  date2 = new Date(date2);

  return fmtShort.formatRange(date1, date2);
}
