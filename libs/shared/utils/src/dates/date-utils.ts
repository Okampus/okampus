import { parse, toSeconds } from 'iso8601-duration';

export function isSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return isSameDay(yesterday, date);
}

export function isBeforeYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  return date.getTime() < yesterday.getTime();
}

export function oneMonthAgo(date: Date): Date {
  date.setHours(0, 0, 0, 0);
  date.setMonth(date.getMonth() - 1);
  return date;
}

export function roundToInterval(date: Date, interval: string): Date {
  const intervalMs = toSeconds(parse(interval)) * 1000;
  const rounded = new Date(Math.floor(date.getTime() / intervalMs) * intervalMs);
  return rounded;
}
