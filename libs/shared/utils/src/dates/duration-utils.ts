import type { Duration } from '@okampus/shared/types';

// Credits to: https://github.com/tolu (MIT)

const numbers = '\\d+';
const fractionalNumbers = `${numbers}(?:[\\.,]${numbers})?`;
const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}W)?(${numbers}D)?`;
const timePattern = `T(${fractionalNumbers}H)?(${fractionalNumbers}M)?(${fractionalNumbers}S)?`;

const iso8601 = `P(?:${datePattern}(?:${timePattern})?)`;

const objMap: (keyof Duration)[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

const defaultDuration: Required<Duration> = Object.freeze({
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

/**
 * The ISO8601 regex for matching / testing durations
 */
export const iso8601Pattern = new RegExp(iso8601);

/** Parse PnYnMnDTnHnMnS format to object */
export const stringToDuration = (durationString: string): Duration => {
  const matches = durationString.replaceAll(',', '.').match(iso8601Pattern);
  if (!matches) throw new RangeError(`invalid duration: ${durationString}`);

  // Slice away first entry in match-array (the input string)
  const slicedMatches: (string | undefined)[] = matches.slice(1);
  if (slicedMatches.filter((v) => v != null).length === 0) throw new RangeError(`invalid duration: ${durationString}`);

  // Check only one fraction is used
  if (slicedMatches.filter((v) => /\./.test(v || '')).length > 1)
    throw new RangeError(`only the smallest unit can be fractional`);

  const duration: Duration = {};

  // Map matches to object
  for (const match of slicedMatches)
    if (match) duration[objMap[slicedMatches.indexOf(match)]] = Number.parseFloat(match) || 0;

  return duration;
};

/** Convert ISO8601 duration object to an end Date. */
export const addDuration = (durationInput: Duration, startDate = new Date()) => {
  const duration = Object.assign({}, defaultDuration, durationInput);

  // Create two equal timestamps, add duration to 'then' and return time difference
  const then = new Date(startDate.getTime());

  then.setFullYear(then.getFullYear() + duration.years);
  then.setMonth(then.getMonth() + duration.months);
  then.setDate(then.getDate() + duration.days);

  // set time as milliseconds to get fractions working for minutes/hours
  const hoursInMs = duration.hours * 3600 * 1000;
  const minutesInMs = duration.minutes * 60 * 1000;
  then.setMilliseconds(then.getMilliseconds() + duration.seconds * 1000 + hoursInMs + minutesInMs);

  // Special case weeks
  then.setDate(then.getDate() + duration.weeks * 7);

  return then;
};

/** Convert ISO8601 duration object to seconds */
export const durationToSeconds = (durationInput: Duration, startDate = new Date()) => {
  const duration = Object.assign({}, defaultDuration, durationInput);

  const now = new Date(startDate.getTime());
  const then = addDuration(duration, now);

  const seconds = (then.getTime() - now.getTime()) / 1000;
  return seconds;
};

export function roundToInterval(date: Date, interval: string): Date {
  const intervalMs = durationToSeconds(stringToDuration(interval)) * 1000;
  const rounded = new Date(Math.floor(date.getTime() / intervalMs) * intervalMs);
  return rounded;
}
