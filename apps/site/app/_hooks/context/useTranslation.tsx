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
} from '../../../config/i18n';

import { determinersAtom, dictsAtom, formattersAtom, langAtom } from '../../_context/global';
import { translate } from '../../../utils/i18n/translate';

import { formatAsBytes, formatAsOctets, isKey } from '@okampus/shared/utils';
import { useAtom } from 'jotai';

import type { Format } from '../../../config/i18n';
import type { TOptions } from '../../../utils/i18n/translate';

export function useTranslation() {
  const [lang] = useAtom(langAtom);
  const [dict] = useAtom(dictsAtom);
  const [formatters, setFormatters] = useAtom(formattersAtom);
  const [determiners] = useAtom(determinersAtom);

  const format: Format = (key, data) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (formatters[key]) return formatters[key].format(data as any);

    let format;
    if (isKey(key, byteFormatters)) {
      format = lang === 'fr-FR' ? formatAsOctets : formatAsBytes;
    } else if (isKey(key, numberFormatters)) {
      const formatter = new Intl.NumberFormat(lang, numberFormatters[key]);
      format = (data: number) => formatter.format(data);
    } else if (isKey(key, dateFormatters)) {
      const formatter = new Intl.DateTimeFormat(lang, dateFormatters[key]);
      format = (data: Date) => formatter.format(data).replace(', ', ' • ').replace(' à', '').replace(' at ', ' @ ');
    } else if (isKey(key, dateRangeFormatters)) {
      const formatter = new Intl.DateTimeFormat(lang, dateRangeFormatters[key]);
      format = (data: [Date, Date]) => formatter.formatRange(data[0], data[1]);
    } else if (isKey(key, listFormatters)) {
      const formatter = new Intl.ListFormat(lang, listFormatters[key]);
      format = (data: string[]) => formatter.format(data);
    } else if (isKey(key, relativeTimeFormatters)) {
      const formatter = new Intl.RelativeTimeFormat(lang, relativeTimeFormatters[key]);
      format = (timeMs: number) => {
        const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
        const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
        const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
        return formatter.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
      };
    } else if (isKey(key, pluralFormatters)) {
      const formatter = new Intl.PluralRules(lang, pluralFormatters[key]);
      format = (data: number) => formatter.select(data);
    }

    if (format) {
      setFormatters({ ...formatters, [key]: { format } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return format(data as any);
    }

    return key;
  };

  function t(key: string, data: TOptions, returnRaw: true): string | Record<string, unknown>;
  function t(key: string, data: TOptions, returnRaw: false): string;
  function t(key: string, data: TOptions): string;
  function t(key: string): string;

  function t(key: string, data: TOptions = {}, returnRaw = false): string | Record<string, unknown> {
    return returnRaw
      ? translate(dict, key, data, format, determiners, true)
      : translate(dict, key, data, format, determiners);
  }

  return { lang, format, determiners, dict, t };
}
