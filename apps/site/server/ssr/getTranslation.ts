import 'server-only';

import { getLang } from './getLang';
import {
  byteFormatters,
  cutoffs,
  dateFormatters,
  dateRangeFormatters,
  getLocaleFromLocalePath,
  listFormatters,
  numberFormatters,
  pluralFormatters,
  relativeTimeFormatters,
  units,
} from '../../config/i18n';
import { translate } from '../../utils/i18n/translate';

import { rootPath } from '../root';
import { formatAsBytes, formatAsOctets, mapObject } from '@okampus/shared/utils';

import { LOCALE_COOKIE } from '@okampus/shared/consts';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Format, Formatters, Locale } from '../../config/i18n';
import type { IntlContext } from '../../types/intl-context.type';
import type { TOptions } from '../../utils/i18n/translate';

const localeRootPath = path.join(rootPath, 'apps', 'site', 'public', 'locales');
const loadPath = cache(async (lang: string, subPath: string) => {
  try {
    return await import(path.join(localeRootPath, lang, `${subPath}.json`)).then((module) => module.default);
  } catch (error) {
    console.error(error);
    return {};
  }
});

export type IntlDict = Record<string, unknown>;
export type IntlDictsCache = { [key in IntlContext]?: IntlDict };

const processDirectory = async (
  directoryPath: string,
  prefix: string,
  dict: IntlDictsCache,
  lang: string,
): Promise<void> => {
  const files = await fs.readdir(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const key = `${prefix}${file.replace('.json', '')}` as IntlContext;

    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      await processDirectory(filePath, `${key}.`, dict, lang);
    } else if (file.endsWith('.json')) {
      dict[key] = await loadPath(lang, filePath);
    }
  }
};

const cachedIntlDicts = cache(async function getDict(lang: string) {
  const localePath = path.join(localeRootPath, lang);
  const dicts: IntlDictsCache = {};

  await processDirectory(localePath, '', dicts, lang);
  return dicts;
});

const cachedFormatters = cache(async function getFormatters(lang: Locale): Promise<Formatters> {
  const byte = mapObject(byteFormatters, () => ({ format: lang === 'fr-FR' ? formatAsOctets : formatAsBytes }));
  const date = mapObject(dateFormatters, (_, config) => ({
    format: (date: Date) => new Intl.DateTimeFormat(lang, config).format(date).replace(', ', ' • '),
  }));
  const dateRange = mapObject(dateRangeFormatters, (_, config) => ({
    format: (value: [Date, Date]) => new Intl.DateTimeFormat(lang, config).formatRange(value[0], value[1]),
  }));
  const number = mapObject(numberFormatters, (_, config) => new Intl.NumberFormat(lang, config));
  const list = mapObject(listFormatters, (_, config) => new Intl.ListFormat(lang, config));
  const relativeTime = mapObject(relativeTimeFormatters, (_, config) => {
    const formatter = new Intl.RelativeTimeFormat(lang, config);
    return {
      format: (timeMs: number) => {
        const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
        const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
        const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
        return formatter.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
      },
    };
  });
  const plural = mapObject(pluralFormatters, (_, config) => {
    const formatter = new Intl.PluralRules(lang, config);
    return { format: (value: number) => formatter.select(value) };
  });

  return { ...byte, ...date, ...dateRange, ...number, ...list, ...relativeTime, ...plural };
});

export type DeterminerType = 'indefinite' | 'definite' | 'indefinite_plural' | 'definite_plural';
export type Determiners = Record<string, Record<DeterminerType, string> | undefined> | undefined;

export async function getTranslation() {
  const cookieLocale = cookies().get(LOCALE_COOKIE)?.value;

  const localePath = await getLang(headers().get('Accept-Language'), cookieLocale);
  const lang = getLocaleFromLocalePath(localePath);

  const formatters = await cachedFormatters(lang);
  const dicts = lang ? await cachedIntlDicts(lang) : {};
  const common = dicts.common;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const format: Format = (key, value) => formatters[key].format(value as any);
  const t = (context: IntlContext, key: string, data: TOptions = {}) =>
    translate(dicts, `${context}.${key}`, data, { format, determiners: dicts.determiners as Determiners, dicts });

  return { lang, common, dicts, format, t };
}
