import { publicProcedure, createTRPCRouter } from './trpc';
import { searchAddress } from './routes/searchAddress';
import { getPresignedUrls } from './routes/getPresignedUrls';
import { getOcrPresignedUrl } from './routes/getOcrPresignedUrl';
import { getEventLogs } from './routes/getEventLogs';
import { getTeamLogs } from './routes/getTeamLogs';
import { getTenantLogs } from './routes/getTenantLogs';
import { getTransactionLogs } from './routes/getTransactionLogs';
import { processReceipt } from './routes/processReceipt';

import { expiredCookieOptions } from '../../config';

import { COOKIE_NAMES, EXPIRED_COOKIE } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';

export const trpcRouter = createTRPCRouter({
  getEventLogs,
  getTeamLogs,
  getTenantLogs,
  getTransactionLogs,
  getPresignedUrls,
  getOcrPresignedUrl,
  searchAddress,
  processReceipt,
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.setCookie(COOKIE_NAMES[TokenType.Access], EXPIRED_COOKIE, expiredCookieOptions);
    ctx.setCookie(COOKIE_NAMES[TokenType.Refresh], EXPIRED_COOKIE, expiredCookieOptions);
  }),
});

export type TRPCRouter = typeof trpcRouter;
