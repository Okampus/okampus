import type { Individual, Tenant } from '@okampus/api/dal';
import type { GraphQLResolveInfo } from 'graphql';

declare module '@fastify/request-context' {
  interface RequestContextData {
    requester?: Individual;
    tenant?: Tenant;
    token?: string;
    gqlInfo?: GraphQLResolveInfo;
  }
}
