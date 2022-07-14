import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthRequest } from '../types/interfaces/auth-request.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.getType() === 'http'
      ? ctx.switchToHttp().getRequest<AuthRequest>()
      : GqlExecutionContext.create(ctx).getContext().req;
    return request?.user;
  },
);
