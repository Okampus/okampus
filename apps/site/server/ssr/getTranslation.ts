import { getNextLang } from './getLang';
import { rootPath } from '../root';
import {
  byteFormatters,
  currencyFormatters,
  cutoffs,
  dateFormatters,
  dateRangeFormatters,
  fallbackLocale,
  listFormatters,
  numberFormatters,
  pluralFormatters,
  relativeTimeFormatters,
  units,
} from '../../config/i18n';
import { translate } from '../../utils/i18n/translate';

import { formatAsBytes, formatAsOctets, mapObject } from '@okampus/shared/utils';

import { cache } from 'react';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Format, Formatters, Locale } from '../../config/i18n';
import type { IntlContext } from '../../types/intl-context.type';
import type { TOptions } from '../../utils/i18n/translate';

import type { Currency } from '@prisma/client';

const localeRootPath = path.join(rootPath, 'apps', 'site', 'public', 'locales');
const loadPath = cache(async (path: string) => {
  try {
    return await fs.readFile(path, 'utf8').then((content) => {
      try {
        return JSON.parse(content);
      } catch (error) {
        console.error(error);
        return {};
      }
    });
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
      dict[key] = await loadPath(filePath);
    }
  }
};

const cachedIntlDicts = cache(async function getDict(locale: Locale) {
  const localePath = path.join(localeRootPath, locale);
  const dicts: IntlDictsCache = {};

  await processDirectory(localePath, '', dicts, locale);
  return dicts;
});

const cachedFormatters = cache(async function getFormatters(locale: Locale): Promise<Formatters> {
  const byte = mapObject(byteFormatters, () => ({ format: locale === 'fr-FR' ? formatAsOctets : formatAsBytes }));
  const currency = mapObject(currencyFormatters, () => ({
    format: ([value, currency]: [number, Currency]) => {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formatter.format(value);
    },
  }));
  const number = mapObject(numberFormatters, (_, config) => new Intl.NumberFormat(locale, config));
  const date = mapObject(dateFormatters, (_, config) => ({
    format: (date: Date | number) => new Intl.DateTimeFormat(locale, config).format(date),
  }));
  const dateRange = mapObject(dateRangeFormatters, (_, config) => ({
    format: (value: [Date | number, Date | number]) =>
      new Intl.DateTimeFormat(locale, config).formatRange(value[0], value[1]),
  }));
  const list = mapObject(listFormatters, (_, config) => new Intl.ListFormat(locale, config));
  const relativeTime = mapObject(relativeTimeFormatters, (_, config) => {
    const formatter = new Intl.RelativeTimeFormat(locale, config);
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
    const formatter = new Intl.PluralRules(locale, config);
    return { format: (value: number) => formatter.select(value) };
  });

  return { ...byte, ...currency, ...number, ...date, ...dateRange, ...list, ...relativeTime, ...plural };
});

export type DeterminerType = 'indefinite' | 'definite' | 'indefinite_plural' | 'definite_plural';
export type Determiners = Record<string, Record<DeterminerType, string> | undefined> | undefined;

export const getTranslation = cache(async function getTranslation(locale?: Locale) {
  locale = locale || getNextLang() || fallbackLocale;
  const formatters = await cachedFormatters(locale);
  const dicts = await cachedIntlDicts(locale);
  const common = dicts.common;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const format: Format = (key, value) => formatters[key].format(value as any);
  const t = (context: IntlContext, key: string, data: TOptions = {}) =>
    translate(dicts, `${context}.${key}`, data, { format, determiners: dicts.determiners as Determiners, dicts });

  return { locale, common, dicts, format, t };
});

export async function getIntlDict(locale: Locale, context: IntlContext) {
  const dicts = locale ? await cachedIntlDicts(locale) : {};
  return { [context]: dicts[context] };
}
