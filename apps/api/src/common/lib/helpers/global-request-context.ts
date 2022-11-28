import { RequestContext } from '@medibloc/nestjs-request-context';
import type { GraphQLResolveInfo } from 'graphql';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import type { User } from '@modules/uaa/users/user.entity';

export class GlobalRequestContext extends RequestContext {
  user: User | null;
  tenant: Tenant | null;
  gqlInfo: GraphQLResolveInfo;
  alreadyPopulated: boolean;
}
