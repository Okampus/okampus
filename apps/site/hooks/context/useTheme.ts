import { themeAtom } from '../../context/global';
import { useAtom } from 'jotai';

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);

  return [
    theme,
    () => {
      if (theme === 'dark') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        setTheme('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        setTheme('dark');
      }
    },
  ] as const;
}
