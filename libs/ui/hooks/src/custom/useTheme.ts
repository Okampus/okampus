import { useState, useEffect } from 'react';

export function useTheme(): ['light' | 'dark', (theme: 'light' | 'dark') => void] {
  const [theme, setTheme] = useState(localStorage.theme ?? 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
}
