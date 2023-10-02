import { createTRPCReact } from '@trpc/react-query';
import type { TRPCRouter } from '../../server/trpc/router';

export const trpcClient = createTRPCReact<TRPCRouter>({});
