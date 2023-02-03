import type { Individual, TenantCore } from '@okampus/api/dal';
import type { GraphQLResolveInfo } from 'graphql';

declare module '@fastify/request-context' {
  interface RequestContextData {
    alreadyPopulated?: boolean;
    requester?: Individual;
    tenant?: TenantCore;
    gqlInfo?: GraphQLResolveInfo;
  }
}
