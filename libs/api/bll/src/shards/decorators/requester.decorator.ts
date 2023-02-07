import { createParamDecorator } from '@nestjs/common';
import { requestContext } from '@fastify/request-context';

export const Requester = createParamDecorator(() => requestContext.get('requester'));
