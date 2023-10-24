import { langAtom } from '../../_context/global';
import { safeCookieOptions } from '../../../config';

import { LOCALE_COOKIE } from '@okampus/shared/consts';

import { useAtom } from 'jotai';
import Cookies from 'universal-cookie';

import type { availableLocales } from '../../../config/i18n';

export function useLocale() {
  const [lang] = useAtom(langAtom);
  const cookieStore = new Cookies();

  return [
    lang,
    (lang: (typeof availableLocales)[number]) => {
      cookieStore.set(LOCALE_COOKIE, lang, { ...safeCookieOptions, expires: new Date(2030, 0, 1) });
      window.location.reload();
    },
  ] as const;
}
