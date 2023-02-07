import { createParamDecorator } from '@nestjs/common';
import { requestContext } from '@fastify/request-context';

export const CurrentTenant = createParamDecorator(() => requestContext.get('tenant'));
