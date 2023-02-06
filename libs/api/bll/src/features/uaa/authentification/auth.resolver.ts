import { AuthContextModel } from './auth-context.model';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service';

import { Requester } from '../../../shards/request-context/requester.decorator';
import { UserModel } from '../../../domains/factories/domains/users/user.model';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../../global/config.module';

import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantPublic } from '@okampus/api/shards';
import { User } from '@okampus/api/dal';
import { UnauthorizedException } from '@nestjs/common';
import { TokenType } from '@okampus/shared/enums';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Individual } from '@okampus/api/dal';
import type { ApiConfig } from '@okampus/shared/types';

interface GraphQLContext {
  req: FastifyRequest;
  reply: FastifyReply;
}

@Resolver(() => UserModel)
export class AuthResolver {
  config: ApiConfig;

  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    this.config = this.configService.config;
  }

  // TODO: Add permission checks
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
    const res = ctx.reply;
    const cookiePublicOptions = { ...this.config.cookies.options, httpOnly: false };
    try {
      void res
        .clearCookie(this.config.cookies.names[TokenType.Access], this.config.cookies.options)
        .clearCookie(this.config.cookies.names[TokenType.Refresh], this.config.cookies.options)
        .clearCookie(this.config.cookies.names.AccessExpiration, cookiePublicOptions)
        .clearCookie(this.config.cookies.names.RefreshExpiration, cookiePublicOptions)
        .clearCookie(this.config.cookies.names[TokenType.WebSocket], cookiePublicOptions)
        .clearCookie(this.config.cookies.names[TokenType.MeiliSearch], cookiePublicOptions);
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
