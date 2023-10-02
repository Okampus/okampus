import { publicProcedure, createTRPCRouter } from './trpc';
import { searchAddress } from './routes/searchAddress';
import { getPresignedUrls } from './routes/getPresignedUrls';
import { getOcrPresignedUrl } from './routes/getOcrPresignedUrl';
import { getEventLogs } from './routes/getEventLogs';
import { getTeamLogs } from './routes/getTeamLogs';
import { getTenantLogs } from './routes/getTenantLogs';
import { getTransactionLogs } from './routes/getTransactionLogs';
import { processReceipt } from './routes/processReceipt';
import { login } from './routes/login';

import { cookieOptions } from '../../config';

import { COOKIE_NAMES } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';

const expiredCookieConfig = { ...cookieOptions, expires: 0 };
export const trpcRouter = createTRPCRouter({
  getEventLogs,
  getTeamLogs,
  getTenantLogs,
  getTransactionLogs,
  getPresignedUrls,
  getOcrPresignedUrl,
  searchAddress,
  processReceipt,
  login,
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.setCookie(COOKIE_NAMES[TokenType.Access], '', expiredCookieConfig);
    ctx.setCookie(COOKIE_NAMES[TokenType.Refresh], '', expiredCookieConfig);
  }),
});

export type TRPCRouter = typeof trpcRouter;
