import { availableLocales, localePaths, fallbackLocale } from '../../config/i18n';
import { includes, isKey, isNotNull } from '@okampus/shared/utils';
import { LOCALE_COOKIE } from '@okampus/shared/consts';
import { cookies, headers } from 'next/headers';
import type { LocalePath } from '../../config/i18n';

const acceptLanguageWithQualityRegex = /([a-z]{1,8}(?:-[a-z]{1,8})?)(?:;q=(0(?:\.\d{1,3})?|1(?:\.0{1,3})?))?/gi;

function getAcceptLanguage(acceptLanguage: string): LocalePath {
  const matches = acceptLanguage ? acceptLanguage.match(acceptLanguageWithQualityRegex) || [] : [];
  if (matches.length === 0) return localePaths[fallbackLocale];

  const langs = matches
    .map((match) => {
      if (!match) return null;
      const parts = match.split(';');
      const quality = parts[1] ? Number.parseFloat(parts[1].split('=')[1]) : 1;
      return { ietf: parts[0], quality };
    })
    .filter(isNotNull)
    .sort((a, b) => b.quality - a.quality);

  const fallbacks = [];
  for (const { ietf } of langs) {
    if (includes(ietf, availableLocales)) return localePaths[ietf];
    for (const [locale, path] of Object.entries(localePaths)) if (locale === ietf) fallbacks.push(path);

    const localePath = ietf.split('-')[0];
    fallbacks.push(isKey(localePath, localePaths) ? localePaths[localePath] : localePath);
  }

  for (const lang of fallbacks) if (isKey(lang, localePaths)) fallbacks.push(localePaths[lang]);

  return localePaths[fallbackLocale];
}

export function getLang(acceptLanguage: string | null, cookieLocale?: string): LocalePath {
  if (cookieLocale) {
    if (includes(cookieLocale, availableLocales)) return localePaths[cookieLocale];
    if (isKey(cookieLocale, localePaths)) return localePaths[cookieLocale];
  } else if (acceptLanguage) {
    // Use the Accept-Language header to determine the language
    const lang = getAcceptLanguage(acceptLanguage);
    return lang;
  }

  return localePaths[fallbackLocale];
}

export function getNextLang() {
  return getLang(headers().get('accept-language'), cookies().get(LOCALE_COOKIE)?.value);
}
