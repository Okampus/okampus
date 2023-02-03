import { User } from '@okampus/api/dal';
import { TenantCore } from '@okampus/api/dal';

export interface GqlWebsocketContext {
  context: {
    user: User;
    tenant: TenantCore;
    headers: object;
  };
}
