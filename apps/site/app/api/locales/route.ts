import { availableLocales, fallbackBaseLocales } from '../../../config/i18n';
import { isIn, isKey } from '@okampus/shared/utils';

import { promises as fs } from 'node:fs';
import * as nodePath from 'node:path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let lang = searchParams.get('lang');
  if (!lang) return new Response('Missing lang', { status: 400 });

  let path = searchParams.get('path');
  if (!path) return new Response('Missing path', { status: 400 });

  if (!isIn(lang, availableLocales)) {
    if (isKey(lang, fallbackBaseLocales)) lang = fallbackBaseLocales[lang];
    else return new Response(`Invalid locale: ${lang}`, { status: 400 });
  }

  path = nodePath.posix.normalize(path);

  const dict = await fs.readFile(nodePath.join(process.cwd(), 'locales', lang, path), 'utf8');
  return new Response(dict, { headers: { 'Content-Type': 'application/json' } });
}
