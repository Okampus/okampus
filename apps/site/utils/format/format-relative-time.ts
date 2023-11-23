import { relativeTimeFormatters } from './format';
import type { Locale } from '../../server/ssr/getLang';

export const cutoffs = [60, 3600, 86_400, 86_400 * 7, 86_400 * 30, 86_400 * 365, Number.POSITIVE_INFINITY];
export const units: Intl.RelativeTimeFormatUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

export function formatRelativeTime(
  locale: Locale,
  date: Date | number,
  key: 'relativeTimeLong' | 'relativeTimeShort' = 'relativeTimeLong',
) {
  const formatter = new Intl.RelativeTimeFormat(locale, relativeTimeFormatters[key]);

  const timeMs = typeof date === 'number' ? date : date.getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
  return formatter.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}
