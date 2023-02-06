import fieldToRelations from '@banksnussman/graphql-fields-to-relations';
import { UnauthorizedException } from '@nestjs/common';
import { requestContext } from '@fastify/request-context';
import type { Individual, TenantCore } from '@okampus/api/dal';

export abstract class RequestContext {
  public autoGqlPopulate(defaultPopulate?: string[]): never[] {
    const info = requestContext.get('gqlInfo');
    if (info && !requestContext.get('alreadyPopulated')) {
      requestContext.set('alreadyPopulated', true);
      const populate = [
        ...fieldToRelations(info),
        ...(info.operation.loc?.source?.body?.includes?.('cursor') ? ['edges.cursor'] : []),
        // TODO: don't rely on the source body to find if the cursor is queried
      ];
      return populate as never[];
    }

    return (defaultPopulate ?? []) as never[];
  }

  public requester(): Individual {
    const requester = requestContext.get('requester');
    if (!requester) throw new UnauthorizedException('Requester is not authenticated');

    return requester;
  }

  public tenant(): TenantCore {
    const tenant = requestContext.get('tenant');
    if (!tenant) throw new UnauthorizedException('Tenant has not been set');

    return tenant;
  }
}
