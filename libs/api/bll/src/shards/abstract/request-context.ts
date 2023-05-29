import { UnauthorizedException } from '@nestjs/common';
import { requestContext } from '@fastify/request-context';
import type { Individual, Tenant } from '@okampus/api/dal';

export abstract class RequestContext {
  public requester(): Individual {
    const requester = requestContext.get('individual');
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
}
