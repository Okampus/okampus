import { langAtom } from '../../_context/global';
import { cookieConfig } from '../../../utils/cookies';

import { LOCALE_COOKIE } from '@okampus/shared/consts';

import { useAtom } from 'jotai';
import Cookies from 'universal-cookie';

import type { availableLocales } from '../../../config/i18n';

export function useLocale() {
  const [lang, setLang] = useAtom(langAtom);
  const cookieStore = new Cookies();

  return [
    lang,
    (lang: (typeof availableLocales)[number]) => {
      document.documentElement.setAttribute('lang', lang);
      setLang(lang);
      cookieStore.set(LOCALE_COOKIE, lang, { ...cookieConfig, expires: new Date(2030, 0, 1) });
      window.location.reload();
    },
  ] as const;
}
