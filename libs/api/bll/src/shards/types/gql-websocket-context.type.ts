import type { User } from '@okampus/api/dal';
import type { TenantCore } from '@okampus/api/dal';

export interface GqlWebsocketContext {
  context: {
    user: User;
    tenant: TenantCore;
    headers: object;
  };
}
