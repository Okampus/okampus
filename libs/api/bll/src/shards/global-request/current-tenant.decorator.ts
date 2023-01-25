import { createParamDecorator } from '@nestjs/common';
import { requestContext } from '@fastify/request-context';

export const Tenant = createParamDecorator(() => requestContext.get('tenant'));
