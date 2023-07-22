import { availableLocales, fallbackBaseLocale, fallbackLocale } from '../locales/i18n';
import { includes, isKey, isNotNull } from '@okampus/shared/utils';
import { cookies, headers } from 'next/headers';

export const LOCALE_COOKIE = 'OKAMPUS_LOCALE';

const acceptLanguageWithQualityRegex = /([a-z]{1,8}(?:-[a-z]{1,8})?)(?:;q=(0(?:\.\d{1,3})?|1(?:\.0{1,3})?))?/gi;

function getAcceptLanguage(): typeof availableLocales[number] {
  const acceptLanguage = headers().get('Accept-Language');
  const matches = acceptLanguage ? acceptLanguage.match(acceptLanguageWithQualityRegex) || [] : [];
  if (matches.length === 0) return fallbackLocale;

  const langs = matches
    .map((match) => {
      if (!match) return null;
      const parts = match.split(';');
      const quality = parts[1] ? Number.parseFloat(parts[1].split('=')[1]) : 1;
      return { ietf: parts[0], quality };
    })
    .filter(isNotNull)
    .sort((a, b) => b.quality - a.quality);

  const langsFallback = [];
  for (const { ietf } of langs) {
    if (includes(ietf, availableLocales)) return ietf;
    if (isKey(ietf, fallbackBaseLocale)) langsFallback.push(fallbackBaseLocale[ietf]);
    langsFallback.push(ietf.split('-')[0]);
  }

  for (const lang of langsFallback) if (isKey(lang, fallbackBaseLocale)) langsFallback.push(fallbackBaseLocale[lang]);

  return fallbackLocale;
}

export async function getLang(): Promise<typeof availableLocales[number]> {
  'use server';

  const cookieLocale = cookies().get(LOCALE_COOKIE)?.value;
  if (!cookieLocale) {
    // Use the Accept-Language header to determine the language
    const lang = getAcceptLanguage();
    return lang;
  }

  if (includes(cookieLocale, availableLocales)) return cookieLocale;
  if (isKey(cookieLocale, fallbackBaseLocale)) return fallbackBaseLocale[cookieLocale];
  return fallbackLocale;
}
