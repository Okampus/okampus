'use client';

import { apolloClient } from '../../_context/apollo';
import { ApolloProvider } from '@apollo/client';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
