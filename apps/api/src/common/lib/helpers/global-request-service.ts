import fieldToRelations from '@banksnussman/graphql-fields-to-relations';
import { RequestContext } from '@medibloc/nestjs-request-context';
import { UnauthorizedException } from '@nestjs/common';
import type { GlobalRequestContext } from '@lib/helpers/global-request-context';
import type { Tenant } from '@tenants/tenant.entity';
import type { User } from '@uaa/users/user.entity';

const detachStrings = new Set(['edges', 'edges.node']);
const forbidStrings = ['pageInfo'];

export abstract class GlobalRequestService {
  public autoGqlPopulate(defaultPopulate?: string[]): readonly never[] {
    const globalRequestContext = RequestContext.get<GlobalRequestContext>();
    const info = globalRequestContext?.gqlInfo;
    if (info && !globalRequestContext.alreadyPopulated) {
      globalRequestContext.alreadyPopulated = true;
      const populate = fieldToRelations(info);
      return populate.filter(
        populateString => !detachStrings.has(populateString)
        && !forbidStrings.some(string => populateString.includes(string)),
      ).map((populateString) => {
        for (const string of detachStrings) {
          if (populateString.includes(`${string}.`))
            populateString = populateString.replace(`${string}.`, '');
        }
        return populateString;
      }) as never[];
    }

    return defaultPopulate as never[] ?? [];
  }

  public currentUser(): User {
    const { user } = RequestContext.get<GlobalRequestContext>();
    if (user === null)
      throw new UnauthorizedException('User is not authenticated');

    return user;
  }

  public currentTenant(): Tenant {
    const { tenant } = RequestContext.get<GlobalRequestContext>();
    if (tenant === null)
      throw new UnauthorizedException('Tenant has not been set');

    return tenant;
  }
}
