import { THEME_COOKIE } from '@okampus/shared/consts';
import { includes } from '@okampus/shared/utils';
import { cookies, headers } from 'next/headers';

const availableThemes = ['light', 'dark'];
const defaultTheme = 'light';

export async function getTheme() {
  'use server';
  const cookieTheme = cookies().get(THEME_COOKIE)?.value;
  if (!cookieTheme) {
    const preference = headers().get('Sec-CH-Prefers-Color-Scheme');
    const theme = includes(preference, availableThemes) ? preference : defaultTheme;
    return theme;
  }

  if (includes(cookieTheme, availableThemes)) return cookieTheme;
  return defaultTheme;
}
