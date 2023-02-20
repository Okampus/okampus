// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service';
import { AuthContextModel } from './auth-context.model';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../../global/config.module';
import { UserModel } from '../../../domains/factories/domains/users/user.model';
import { Requester } from '../../../shards/decorators/requester.decorator';

import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantPublic } from '@okampus/api/shards';
import { User } from '@okampus/api/dal';
import { UnauthorizedException } from '@nestjs/common';
import { TokenType } from '@okampus/shared/enums';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Individual } from '@okampus/api/dal';

interface GraphQLContext {
  req: FastifyRequest;
  reply: FastifyReply;
}

@Resolver(() => UserModel)
export class AuthResolver {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {}

  @TenantPublic()
  @Mutation(() => AuthContextModel)
  public async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Context() ctx: GraphQLContext
  ): Promise<AuthContextModel> {
    return await this.authService.login({ username, password }, ctx.req, ctx.reply);
  }

  @TenantPublic()
  @Mutation(() => Boolean)
  public async logout(@Context() ctx: GraphQLContext): Promise<boolean> {
    const { names, options } = this.configService.config.cookies;

    const res = ctx.reply;
    const cookiePublicOptions = { ...options, httpOnly: false };

    try {
      void res
        .clearCookie(names[TokenType.Access], options)
        .clearCookie(names[TokenType.Refresh], options)
        .clearCookie(names.AccessExpiration, cookiePublicOptions)
        .clearCookie(names.RefreshExpiration, cookiePublicOptions)
        .clearCookie(names[TokenType.WebSocket], cookiePublicOptions)
        .clearCookie(names[TokenType.MeiliSearch], cookiePublicOptions);
      return true;
    } catch {
      return false;
    }
  }

  @Mutation(() => Boolean)
  public async wsToken(@Requester() user: User, @Context() ctx: GraphQLContext): Promise<boolean> {
    this.authService.addWebSocketTokenIfAuthenticated(ctx.reply, user.id);
    return true;
  }

  @Query(() => AuthContextModel)
  public async me(@Requester() requester: Individual, @Context() ctx: GraphQLContext): Promise<AuthContextModel> {
    if (!(requester instanceof User)) throw new UnauthorizedException('Only users can query their auth context');
    return await this.authService.getAuthContext(requester, ctx.req, ctx.reply);
  }
}
