import { UnauthorizedException } from '@nestjs/common';
import { requestContext } from '@fastify/request-context';
import { gqlInfoToRelations } from '@okampus/shared/utils';

import type { User, Tenant } from '@okampus/api/dal';
import type { GraphQLResolveInfo } from 'graphql';

export abstract class RequestContext {
  public requester(): User {
    const requester = requestContext.get('requester');
    if (!requester) throw new UnauthorizedException('Requester is not authenticated');

    return requester;
  }

  public tenant(): Tenant {
    const tenant = requestContext.get('tenant');
    if (!tenant) throw new UnauthorizedException('Tenant has not been set');

    return tenant;
  }

  public token(): string {
    const token = requestContext.get('token');
    if (!token) throw new UnauthorizedException('Token has not been set');

    return token;
  }

  public autoPopulate(excludeFields: string[] = [], maxDepth = 8): string[] {
    const gqlInfo = requestContext.get('gqlInfo');
    if (!gqlInfo) return [];
    return gqlInfoToRelations(gqlInfo, excludeFields, maxDepth);
  }

  public gqlInfo(): GraphQLResolveInfo | null {
    const gqlInfo = requestContext.get('gqlInfo');
    if (!gqlInfo) return null;
    return gqlInfo;
  }
}
