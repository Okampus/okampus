// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../graphql/hasura.service';
import { Requester } from '../../shards/decorators/requester.decorator';
import { loadConfig } from '../../shards/utils/load-config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { Args, Context, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantPublic } from '@okampus/api/shards';
import { getSelectionSet } from '@okampus/shared/utils';
import { COOKIE_NAMES } from '@okampus/shared/consts';
import { TokenExpiration, TokenType } from '@okampus/shared/enums';

import type { LoginDto } from './auth.types';
import type { GQLContext } from '../../types/gql-context';
import type { Individual, UserInfo } from '@okampus/api/dal';
import type { ApiConfig } from '@okampus/shared/types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('UserInfo')
export class AuthResolver {
  constructor(
    private readonly configService: ConfigService,
    private readonly hasuraService: HasuraService,
    private readonly authService: AuthService
  ) {}

  @TenantPublic()
  @Mutation()
  public async login(
    @Args('dto') dto: LoginDto,
    @Context() ctx: GQLContext,
    @Info() info: GraphQLResolveInfo
  ): Promise<UserInfo> {
    return await this.authService.login(dto, getSelectionSet(info), ctx.req, ctx.reply);
  }

  @TenantPublic()
  @Mutation()
  public async logout(@Context() ctx: GQLContext): Promise<boolean> {
    const options = loadConfig<ApiConfig['cookies']['options']>(this.configService, 'cookies');

    const res = ctx.reply;
    const cookiePublicOptions = { ...options, httpOnly: false };

    try {
      void res
        .clearCookie(COOKIE_NAMES[TokenType.Access], options)
        .clearCookie(COOKIE_NAMES[TokenType.Refresh], options)
        .clearCookie(COOKIE_NAMES[TokenType.MeiliSearch], cookiePublicOptions)
        .clearCookie(COOKIE_NAMES[TokenType.WebSocket], cookiePublicOptions)
        .clearCookie(COOKIE_NAMES[TokenExpiration.AccessExpiration], cookiePublicOptions)
        .clearCookie(COOKIE_NAMES[TokenExpiration.RefreshExpiration], cookiePublicOptions);
      return true;
    } catch {
      return false;
    }
  }

  @Query()
  public async me(@Requester() requester: Individual, @Info() info: GraphQLResolveInfo): Promise<UserInfo> {
    if (!requester.user) throw new BadRequestException('No user found');
    const data = await this.hasuraService.findByPk('userInfoByPk', getSelectionSet(info), { id: requester.user.id });
    return data.userInfoByPk;
  }

  // @TenantPublic()
  // @Mutation(() => Boolean)
  // public async logout(@Context() ctx: GQLContext): Promise<boolean> {
  //   const { options } = loadConfig<ApiConfig['cookies']>(this.configService, 'cookies');

  //   const cookiePublicOptions = { ...options, httpOnly: false };

  //   try {
  //     void ctx.reply
  //       .clearCookie(COOKIES_NAMES[TokenType.Access], options)
  //       .clearCookie(COOKIES_NAMES[TokenType.Refresh], options)
  //       .clearCookie(COOKIES_NAMES[TokenType.WebSocket], cookiePublicOptions)
  //       .clearCookie(COOKIES_NAMES[TokenType.MeiliSearch], cookiePublicOptions)
  //       .clearCookie(COOKIES_NAMES[TokenExpiration.AccessExpiration], cookiePublicOptions)
  //       .clearCookie(COOKIES_NAMES[TokenExpiration.RefreshExpiration], cookiePublicOptions);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }

  // @Mutation(() => Boolean)
  // public async wsToken(@Requester() user: Individual, @Context() ctx: GQLContext): Promise<boolean> {
  //   this.authService.addWebSocketTokenIfAuthenticated(ctx.reply, user.id);
  //   return true;
  // }

  // @Query(() => Boolean)
  // public async me(@Requester() requester: Individual, @Context() ctx: GQLContext): Promise<boolean> {
  //   return true;
  //   // if (!(requester.individualKind === IndividualKind.User))
  //   //   throw new UnauthorizedException('Only users can query their auth context');

  //   // return await this.authService.getAuthContext(requester as User, ctx.req, ctx.reply);
  // }
}
