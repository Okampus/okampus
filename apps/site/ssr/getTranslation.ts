import 'server-only';

import { getLang } from './getLang';
import { translate } from '../utils/i18n/translate';
import {
  cutoffs,
  dateFormatters,
  listFormatters,
  numberFormatters,
  pluralFormatters,
  timeFormatters,
  units,
} from '../config/i18n';

import { isNotNull, mapObject } from '@okampus/shared/utils';

import { cache } from 'react';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Format, Formatters } from '../config/i18n';
import type { TOptions } from '../utils/i18n/translate';

const localePathBase = path.join(process.cwd(), 'locales');
const loadPath = async (lang: string, subPath: string) => {
  try {
    return await fetch(`/api/locales?lang=${lang}&dictPath=${subPath}`).then((res) => res.json());
  } catch {
    return {};
  }
};

const cachedDeterminers = cache(async (lang: string) => await loadPath(lang, 'determiners.json'));

export type Dicts = Record<string, Record<string, unknown>>;
const cachedDict = cache(async function getDict(lang: string) {
  const localePath = path.join(localePathBase, lang);
  const dicts: { [key: string]: Record<string, unknown> } = {};

  const paths = await fs.readdir(localePath, { withFileTypes: true });

  // Load files only one level deep
  const subPaths = await Promise.all(
    paths.map(async (subPath) => {
      if (subPath.isDirectory()) {
        const subSubPaths = await fs.readdir(path.join(localePath, subPath.name), { withFileTypes: true });
        return [
          subPath.name,
          subSubPaths
            .filter((subSubPath) => !subSubPath.isDirectory() && subSubPath.name.endsWith('.json'))
            .map((subSubPath) => subSubPath.name),
        ] as const;
      }
      if (subPath.name.endsWith('.json')) return [subPath.name, [] as string[]] as const;
      return null;
    })
  );

  await Promise.all(
    subPaths.filter(isNotNull).flatMap(async ([_path, subPaths]) => {
      const promise =
        subPaths.length === 0
          ? loadPath(lang, _path).then((dict) => (dicts[_path.split('.json')[0]] = dict))
          : Promise.all(
              subPaths.map((subPath) =>
                loadPath(lang, path.join(_path, subPath)).then(
                  (dict) => (dicts[`${_path}.${subPath.split('.json')[0]}`] = dict)
                )
              )
              // eslint-disable-next-line @typescript-eslint/no-empty-function
            ).then(() => {});

      await promise;
    })
  );

  return dicts;
});

const cachedFormatters = cache(async function getFormatters(lang: string): Promise<Formatters> {
  const date = mapObject(dateFormatters, (_, config) => ({
    format: (date: Date) => new Intl.DateTimeFormat(lang, config).format(date).replace(', ', ' • '),
  }));
  const number = mapObject(numberFormatters, (_, config) => new Intl.NumberFormat(lang, config));
  const list = mapObject(listFormatters, (_, config) => new Intl.ListFormat(lang, config));
  const relativeTime = mapObject(timeFormatters, (_, config) => {
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

  return { ...date, ...number, ...list, ...relativeTime, ...plural };
});

export type DeterminerType = 'indefinite' | 'definite' | 'indefinite_plural' | 'definite_plural';
export type Determiners = Record<string, Record<DeterminerType, string>>;

export async function getTranslation() {
  const lang = await getLang();
  const formatters = await cachedFormatters(lang);
  const determiners = (await cachedDeterminers(lang)) ?? {};
  const dict = await cachedDict(lang);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const format: Format = (key, value) => formatters[key].format(value as any);
  const t = (key: string, data: TOptions = {}) => translate(dict, key, data, format, determiners);

  return { lang, determiners, dict, format, t };
}
