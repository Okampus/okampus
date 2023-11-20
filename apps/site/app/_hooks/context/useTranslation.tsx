'use client';

import {
  numberFormatters,
  dateFormatters,
  listFormatters,
  relativeTimeFormatters,
  pluralFormatters,
  cutoffs,
  units,
  byteFormatters,
  dateRangeFormatters,
  currencyFormatters,
} from '../../../config/i18n';

import { dictsIntlAtom, formattersAtom, localeAtom, determinersIntlAtom } from '../../_context/global';
import { translate } from '../../../utils/i18n/translate';

import { formatAsBytes, formatAsOctets, isKey } from '@okampus/shared/utils';
import { useAtom } from 'jotai';

import type { Format } from '../../../config/i18n';
import type { IntlContext } from '../../../types/intl-context.type';
import type { TOptions } from '../../../utils/i18n/translate';
import type { Currency } from '@prisma/client';

export function useTranslation() {
  const [locale] = useAtom(localeAtom);

  const [formatters, setFormatters] = useAtom(formattersAtom);
  const [dictsIntl] = useAtom(dictsIntlAtom);
  const [determinersIntl] = useAtom(determinersIntlAtom);

  const format: Format = (key, data) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (formatters[key]) return formatters[key].format(data as any);

    let currentFormat;
    if (isKey(key, byteFormatters)) {
      currentFormat = locale === 'fr-FR' ? formatAsOctets : formatAsBytes;
    } else if (isKey(key, currencyFormatters)) {
      currentFormat = (data: [number, Currency]) => {
        const formatter = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: data[1],
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return formatter.format(data[0]);
      };
    } else if (isKey(key, numberFormatters)) {
      const formatter = new Intl.NumberFormat(locale, numberFormatters[key]);
      currentFormat = (data: number) => formatter.format(data);
    } else if (isKey(key, dateFormatters)) {
      const formatter = new Intl.DateTimeFormat(locale, dateFormatters[key]);
      currentFormat = (data: Date) => formatter.format(data);
    } else if (isKey(key, dateRangeFormatters)) {
      const formatter = new Intl.DateTimeFormat(locale, dateRangeFormatters[key]);
      currentFormat = (data: [Date, Date]) => formatter.formatRange(data[0], data[1]);
    } else if (isKey(key, listFormatters)) {
      const formatter = new Intl.ListFormat(locale, listFormatters[key]);
      currentFormat = (data: string[]) => formatter.format(data);
    } else if (isKey(key, relativeTimeFormatters)) {
      const formatter = new Intl.RelativeTimeFormat(locale, relativeTimeFormatters[key]);
      currentFormat = (timeMs: number) => {
        const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
        const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
        const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
        return formatter.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
      };
    } else if (isKey(key, pluralFormatters)) {
      const formatter = new Intl.PluralRules(locale, pluralFormatters[key]);
      currentFormat = (data: number) => formatter.select(data);
    }

    if (currentFormat) {
      setFormatters({ ...formatters, [key]: { format: currentFormat } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return currentFormat(data as any);
    }

    return key;
  };

  function t(context: IntlContext, key: string, data: TOptions, returnRaw: true): string | Record<string, unknown>;
  function t(context: IntlContext, key: string, data: TOptions, returnRaw: false): string;
  function t(context: IntlContext, key: string, data: TOptions): string;
  function t(context: IntlContext, key: string): string;

  function t(
    context: IntlContext,
    key: string,
    data: TOptions = {},
    returnRaw = false,
  ): string | Record<string, unknown> {
    const dict = dictsIntl[context];
    if (!dict) return key;
    return returnRaw
      ? translate(dict, key, data, { dicts: dictsIntl, format, determiners: determinersIntl }, true)
      : translate(dict, key, data, { dicts: dictsIntl, format, determiners: determinersIntl });
  }

  return { locale, format, dictsIntl, t };
}
