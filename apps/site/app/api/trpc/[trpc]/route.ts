import { createContext } from '../../../../server/trpc/context';
import { trpcRouter as router } from '../../../../server/trpc/router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) => fetchRequestHandler({ endpoint: '/api/trpc', req, router, createContext });
export { handler as GET, handler as POST };
