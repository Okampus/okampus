import { availableLocales, fallbackBaseLocales } from '../../../config/i18n';
import { isIn, isKey } from '@okampus/shared/utils';

import { promises as fs } from 'node:fs';
import path from 'node:path';

const basePath = path.join(process.cwd(), process.env.NEXT_PUBLIC_STATIC_FOLDER_PATH ?? '', 'locales');
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let lang = searchParams.get('lang');
  if (!lang) return new Response('Missing lang', { status: 400 });

  if (!isIn(lang, availableLocales)) {
    if (isKey(lang, fallbackBaseLocales)) lang = fallbackBaseLocales[lang];
    else return new Response(`Invalid locale: ${lang}`, { status: 400 });
  }

  const dictPath = searchParams.get('dictPath');
  if (!dictPath) return new Response('Missing dictPath', { status: 400 });

  const dict = await fs.readFile(path.join(basePath, lang, path.posix.normalize(dictPath)), 'utf8');
  return new Response(dict, { headers: { 'Content-Type': 'application/json' } });
}
