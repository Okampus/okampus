import { createParamDecorator } from '@nestjs/common';
import { requestContext } from '@fastify/request-context';

export const ReqTenant = createParamDecorator(() => requestContext.get('tenant'));
