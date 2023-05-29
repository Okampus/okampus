import type { Individual, Tenant } from '@okampus/api/dal';

export interface GqlWebsocketContext {
  context: {
    user: Individual;
    tenant: Tenant;
    headers: object;
  };
}
