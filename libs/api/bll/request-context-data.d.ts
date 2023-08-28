import type { User, Tenant } from '@okampus/api/dal';
import type { GraphQLResolveInfo } from 'graphql';

declare module '@fastify/request-context' {
  interface RequestContextData {
    requester?: User;
    tenant?: Tenant;
    token?: string;
    gqlInfo?: GraphQLResolveInfo;
  }
}
