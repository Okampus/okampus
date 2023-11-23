import { includes, isNotNull } from '@okampus/shared/utils';
import { LOCALE_COOKIE } from '@okampus/shared/consts';
import { cookies, headers } from 'next/headers';

export const availableLocales = ['fr-FR', 'en-US'] as const;
export const fallbackLocale = 'fr-FR' as const;
export type Locale = (typeof availableLocales)[number];

const acceptLanguageWithQualityRegex = /([a-z]{1,8}(?:-[a-z]{1,8})?)(?:;q=(0(?:\.\d{1,3})?|1(?:\.0{1,3})?))?/gi;

function getAcceptLanguage(acceptLanguage: string): Locale {
  const matches = acceptLanguage ? acceptLanguage.match(acceptLanguageWithQualityRegex) || [] : [];
  if (matches.length === 0) return fallbackLocale;

  const locales = matches
    .map((match) => {
      if (!match) return null;
      const parts = match.split(';');
      const quality = parts[1] ? Number.parseFloat(parts[1].split('=')[1]) : 1;
      return { ietf: parts[0], quality };
    })
    .filter(isNotNull)
    .sort((a, b) => b.quality - a.quality);

  const fallbacks = [];
  for (const { ietf } of locales) {
    if (includes(ietf, availableLocales)) return ietf;
    for (const [locale, path] of availableLocales) if (locale === ietf) fallbacks.push(path);

    const lang = ietf.split('-')[0];
    const langFallback = availableLocales.find((locale) => locale.startsWith(`${lang}-`));
    if (langFallback) return langFallback;
  }

  return fallbackLocale;
}

export function getLocale(acceptLanguage: string | null, cookieLocale?: string): Locale {
  if (cookieLocale) {
    if (includes(cookieLocale, availableLocales)) return cookieLocale;
  } else if (acceptLanguage) {
    // Use the Accept-Language header to determine the locale
    return getAcceptLanguage(acceptLanguage);
  }

  return fallbackLocale;
}

export function getNextLang() {
  return getLocale(headers().get('accept-language'), cookies().get(LOCALE_COOKIE)?.value);
}
