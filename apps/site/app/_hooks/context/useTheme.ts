import { themeAtom } from '../../_context/global';
import { safeCookieOptions } from '../../../config';

import { THEME_COOKIE } from '@okampus/shared/consts';

import { useAtom } from 'jotai';
import Cookies from 'universal-cookie';

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);
  const cookieStore = new Cookies();

  return [
    theme,
    () => {
      if (theme === 'dark') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        setTheme('light');
        cookieStore.set(THEME_COOKIE, 'light', { ...safeCookieOptions, expires: new Date(2030, 0, 1) });
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        setTheme('dark');
        cookieStore.set(THEME_COOKIE, 'dark', { ...safeCookieOptions, expires: new Date(2030, 0, 1) });
      }
    },
  ] as const;
}
