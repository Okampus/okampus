import fieldToRelations from '@banksnussman/graphql-fields-to-relations';
import { UnauthorizedException } from '@nestjs/common';
import { requestContext } from '@fastify/request-context';
import type { Individual, TenantCore } from '@okampus/api/dal';

export abstract class RequestContext {
  public autoGqlPopulate(defaultPopulate?: string[]): never[] {
    const info = requestContext.get('gqlInfo');
    if (info && !requestContext.get('alreadyPopulated')) {
      requestContext.set('alreadyPopulated', true);
      const cursor = info.operation.loc?.source?.body?.includes?.('cursor') ? ['edges.cursor'] : [];
      return <never[]>[...fieldToRelations(info), ...cursor];
    }

    return <never[]>defaultPopulate ?? [];
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
