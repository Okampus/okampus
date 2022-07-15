import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { GqlContext } from '../../../auth/jwt-auth.guard';
import type { CookiesAuthRequest } from '../types/interfaces/auth-request.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http')
      return ctx.switchToHttp().getRequest<CookiesAuthRequest>().user;

    const { req, context }: GqlContext = GqlExecutionContext.create(ctx).getContext();
    return context?.headers ? context.user : req.user;
  },
);
