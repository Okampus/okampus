import { RequestContext } from '@medibloc/nestjs-request-context';
import type { GraphQLResolveInfo } from 'graphql';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import type { User } from '@modules/uua/users/user.entity';

export class FullRequestContext extends RequestContext {
  user: User;
  tenant: Tenant;
  gqlInfo: GraphQLResolveInfo;
}
