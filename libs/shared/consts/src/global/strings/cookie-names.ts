import { TokenExpiration, TokenType } from '@okampus/shared/enums';

export const COOKIE_NAMES = {
  [TokenType.Access]: 'access_token',
  [TokenType.Refresh]: 'refresh_token',
  [TokenType.MeiliSearch]: 'meilisearch_key',
  [TokenType.WebSocket]: 'ws_token',
  [TokenType.Bot]: 'bot_token',
  [TokenExpiration.AccessExpiration]: 'access_exp',
  [TokenExpiration.RefreshExpiration]: 'refresh_exp',
};
