'use client';

import { trpcUrl } from '../../../config';
import { trpcClient as trpc } from '../../_context/trpcClient';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

import { useState } from 'react';
import SuperJSON from 'superjson';

export default function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({ transformer: SuperJSON, links: [httpBatchLink({ url: trpcUrl })] }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
