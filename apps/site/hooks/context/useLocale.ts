import { langAtom } from '../../context/global';
import { useAtom } from 'jotai';
import type { availableLocales } from '../../locales/i18n';

export function useLocale() {
  const [lang, setLang] = useAtom(langAtom);

  return [
    lang,
    (lang: typeof availableLocales[number]) => {
      document.documentElement.setAttribute('lang', lang);
      setLang(lang);
    },
  ] as const;
}
