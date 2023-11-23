import rootPath from './server/root';
import { availableLocales, fallbackLocale } from './server/ssr/getLang';

import debug from 'debug';
import { getRequestConfig } from 'next-intl/server';
import { cache } from 'react';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Locale } from './server/ssr/getLang';
import type { IntlConfig } from 'next-intl';

const debugLog = debug('okampus:server:i18n');
debug.enable('okampus:server:i18n');

const loadPath = cache(async (path: string) => {
  try {
    return await fs.readFile(path, 'utf8').then((content) => {
      try {
        return JSON.parse(content);
      } catch (error) {
        debugLog(error);
        return {};
      }
    });
  } catch (error) {
    debugLog(error);
    return {};
  }
});

const i18nFileNames = [
  'Actions',
  'Bank',
  'Common',
  'Determiners',
  'Entities',
  'Enums',
  'Home',
  'ServerErrors',
] as const;

type I18nFileNames = Array<(typeof i18nFileNames)[number]> | ReadonlyArray<(typeof i18nFileNames)[number]>;
export async function getIntlMessages(locale: Locale, i18nFiles: I18nFileNames = i18nFileNames) {
  const folder = path.join(rootPath, 'apps', 'site', 'public', 'locales', locale.slice(0, 2));
  const files = await Promise.all(
    i18nFiles.map(async (file) => {
      const filePath = path.join(folder, `${file}.json`);
      return [file, await loadPath(filePath)];
    }),
  );

  return Object.fromEntries(files);
}

const config = getRequestConfig(async ({ locale }) => ({
  messages: await getIntlMessages(availableLocales.includes(locale as Locale) ? (locale as Locale) : fallbackLocale),
})) as (params: { locale: string }) => IntlConfig | Promise<IntlConfig>;

export default config;
