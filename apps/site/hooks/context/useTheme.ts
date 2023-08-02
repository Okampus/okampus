import { themeAtom } from '../../context/global';
import { cookieConfig } from '../../utils/cookies';
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
        cookieStore.set(THEME_COOKIE, 'light', cookieConfig);
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        setTheme('dark');
        cookieStore.set(THEME_COOKIE, 'dark', cookieConfig);
      }
    },
  ] as const;
}
