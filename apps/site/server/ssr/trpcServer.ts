import { baseUrl } from '../../config';
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';

import SuperJSON from 'superjson';
import type { TRPCRouter } from '../trpc/router';

export const serverClient = createTRPCNext<TRPCRouter>({
  config: ({ ctx }) => {
    return {
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          // The server needs to know your app's full url
          url: `${baseUrl}/api/trpc`,
          headers() {
            if (!ctx?.req?.headers) return {};
            return { cookie: ctx.req.headers.cookie };
          },
        }),
      ],
    };
  },
  ssr: true,
});
