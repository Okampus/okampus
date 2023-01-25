const fmtShort = Intl.DateTimeFormat('fr', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
});

export function formatDate(date: Date): string {
  date = new Date(date);

  return fmtShort.format(date);
}

export function formatDateRange(date1: string | Date, date2: string | Date): string {
  date1 = new Date(date1);
  date2 = new Date(date2);

  console.log('date1', date1, 'date2', date2);
  return fmtShort.formatRange(date1, date2);
}
