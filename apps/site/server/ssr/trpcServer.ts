import { trpcUrl } from '../../config';
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
          url: trpcUrl,
          fetch(url, options) {
            return fetch(url, { ...options, credentials: 'include' });
          },
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
