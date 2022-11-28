import fieldToRelations from '@banksnussman/graphql-fields-to-relations';
import { RequestContext } from '@medibloc/nestjs-request-context';
import type { GlobalRequestContext } from '@common/lib/helpers/global-request-context';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import type { User } from '@modules/uua/users/user.entity';

export abstract class GlobalRequestService {
  public autoGqlPopulate(defaultPopulate?: string[]): readonly never[] {
    const globalRequestContext = RequestContext.get<GlobalRequestContext>();
    const info = globalRequestContext.gqlInfo;
    if (info && !globalRequestContext.alreadyPopulated) {
      globalRequestContext.alreadyPopulated = true;
      return fieldToRelations(info) as never[];
    }

    return defaultPopulate as never[] ?? [];
  }

  public currentUser(): User {
    return RequestContext.get<GlobalRequestContext>().user;
  }

  public currentTenant(): Tenant {
    return RequestContext.get<GlobalRequestContext>().tenant;
  }
}
