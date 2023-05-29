import { removeDiacritics } from '../strings/remove-diacritics';

// limit year to next decade
const yearLongOrShortRegex = `(?<year>(?:19)?[789]\\d|(?:20)?[0-${
  (Math.floor(new Date().getFullYear() / 10) % 10) + 1
}]\\d)`;
const yearLongRegex = `(?<year>19[789]\\d|20[0-${(Math.floor(new Date().getFullYear() / 10) % 10) + 1}]\\d)`;
const monthNumberRegex = '(?<month>0[1-9]|1[012]|[1-9])';
const dayRegex = '(?<day>[12]\\d|3[01]|0[1-9]|[1-9])';

const dmyRegex = new RegExp(`${dayRegex} ${monthNumberRegex} ${yearLongOrShortRegex}`);
const mdyRegex = new RegExp(`${monthNumberRegex} ${dayRegex} ${yearLongOrShortRegex}`);
const ymdRegex = new RegExp(`${yearLongRegex} ${monthNumberRegex} ${dayRegex}`);

type MonthFormat = 'long' | 'numeric' | '2-digit' | 'short' | 'narrow';
function monthsForLocale(localeName = 'fr-FR', monthFormat: MonthFormat = 'long') {
  const format = new Intl.DateTimeFormat(localeName, { month: monthFormat }).format;
  const monthNames = [...Array.from({ length: 12 }).keys()]
    .map((m) => format(new Date(Date.UTC(1970, m % 12))))
    .map(removeDiacritics)
    .map((month) => month.toLowerCase());

  return {
    entries: monthNames.map((month, index) => [month, index + 1] as const),
    regex: monthNames.map(monthNameRegex).join('|'),
  };
}

const currentLocales = ['fr', 'en'];
const currentLocalesMonthNames = currentLocales.map((locale) => monthsForLocale(locale));
const allMonthNamesRegex = currentLocalesMonthNames.map((locale) => locale.regex).join('|');
const allMonthNamesEntries = currentLocalesMonthNames.flatMap((locale) => locale.entries);

const dmyMonthNameRegex = new RegExp(`${dayRegex} ?(?<monthName>${allMonthNamesRegex}) ?${yearLongOrShortRegex}`);
const mdyMonthNameRegex = new RegExp(`(?<monthName>${allMonthNamesRegex}) ?${dayRegex} ${yearLongOrShortRegex}`);

function monthNameRegex(month: string) {
  if (month.length <= 3) return `(?:${month})`;
  if (month.length === 4) return `(?:${month.slice(0, 3)}(?:${month[3]})?)`;
  return `(?:${month.slice(0, 3)}(?:${month[3]}(?:${month.slice(4)})?)?)`;
}

function isMatchCorrect(
  match: RegExpMatchArray | null
): match is RegExpMatchArray & { groups: { day: string; month: string; year: string } } {
  return !!(match && match.groups && 'day' in match.groups && 'month' in match.groups && 'year' in match.groups);
}

function isMonthNameMatchCorrect(
  match: RegExpMatchArray | null
): match is RegExpMatchArray & { groups: { day: string; monthName: string; year: string } } {
  return !!(match && match.groups && 'day' in match.groups && 'monthName' in match.groups && 'year' in match.groups);
}

const getCorrectYear = (year: string) => {
  if (Number.parseInt(year) < 70) return `20${year}`;
  if (Number.parseInt(year) < 100) return `19${year}`;
  return year;
};

export function extractDate(value: string) {
  const clean = removeDiacritics(value).toLowerCase().replace(/\W/g, ' ').replace(/\s+/g, ' ');

  // first, test YMD, DMY, MDY (order is important)
  const regexToTest = [ymdRegex, dmyRegex, mdyRegex];
  for (const regex of regexToTest) {
    const match = clean.match(regex);
    if (isMatchCorrect(match)) {
      const { day, month, year } = match.groups;

      return new Date(`${getCorrectYear(year)}-${month}-${day}`);
    }
  }

  // then, test month names (order is not important)
  const monthNameRegexToTest = [dmyMonthNameRegex, mdyMonthNameRegex];
  for (const regex of monthNameRegexToTest) {
    const match = clean.match(regex);
    if (isMonthNameMatchCorrect(match)) {
      const { day, monthName, year } = match.groups;
      const monthNumber = allMonthNamesEntries.find(([name]) => name.startsWith(monthName))?.[1];
      if (monthNumber) return new Date(`${getCorrectYear(year)}-${monthNumber}-${day}`);
    }
  }

  return null;
}

console.log(extractDate('02/06/22'));
