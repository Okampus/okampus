import { TokenExpiration, TokenType } from '@okampus/shared/enums';

export const COOKIE_NAMES = {
  [TokenType.Access]: 'OKAMPUS_ACCESS_TOKEN',
  [TokenType.Refresh]: 'OKAMPUS_REFRESH_TOKEN',
  [TokenType.Bot]: 'OKAMPUS_BOT_TOKEN',
  [TokenExpiration.AccessExpiration]: 'OKAMPUS_ACCESS_EXPIRES',
  [TokenExpiration.RefreshExpiration]: 'OKAMPUS_REFRESH_EXPIRES',
};

export const NEXT_PAGE_COOKIE = 'OKAMPUS_NEXT_PAGE';
export const THEME_COOKIE = 'OKAMPUS_THEME';
export const LOCALE_COOKIE = 'OKAMPUS_LOCALE';
