import { TRPCError, initTRPC } from '@trpc/server';
import SuperJSON from 'superjson';

import type { createContext } from './context';

const t = initTRPC.context<typeof createContext>().create({ transformer: SuperJSON });

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not logged in.' });
  return next();
});
