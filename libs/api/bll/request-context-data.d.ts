import type { Individual, Tenant } from '@okampus/api/dal';

declare module '@fastify/request-context' {
  interface RequestContextData {
    requester?: Individual;
    tenant?: Tenant;
    token?: string;
  }
}
