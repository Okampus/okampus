import type { User, Tenant } from '@okampus/api/dal';

export interface GqlWebsocketContext {
  context: {
    user: User;
    tenant: Tenant;
    headers: object;
  };
}
