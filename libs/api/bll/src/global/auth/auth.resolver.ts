import { AuthService } from './auth.service';

import { HasuraService } from '../graphql/hasura.service';
import { Requester } from '../../shards/decorators/requester.decorator';
import { loadConfig } from '../../shards/utils/load-config';

import { ReqTenant } from '../../shards/decorators/tenant.decorator';

import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { Args, Context, Info, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User, UserRepository } from '@okampus/api/dal';
import { TenantPublic } from '@okampus/api/shards';
import { getSelectionSet } from '@okampus/shared/utils';
import { COOKIE_NAMES } from '@okampus/shared/consts';
import { AdminPermissions, TokenExpiration, TokenType } from '@okampus/shared/enums';

import type { LoginDto } from './auth.types';
import type { GQLContext } from '../../types/gql-context';
import type { Tenant } from '@okampus/api/dal';
import type { ApiConfig } from '@okampus/shared/types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('User')
export class AuthResolver {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly hasuraService: HasuraService,
    private readonly authService: AuthService,
  ) {}

  @TenantPublic()
  @Mutation()
  public async login(
    @Args('dto') dto: LoginDto,
    @Context() ctx: GQLContext,
    @Info() info: GraphQLResolveInfo,
  ): Promise<{
    user: User;
    canManageTenant: boolean;
  }> {
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
  public async me(
    @Requester() requester: User,
    @ReqTenant() tenant: Tenant,
    @Info() info: GraphQLResolveInfo,
  ): Promise<{
    user: User;
    canManageTenant: boolean;
  }> {
    if (!requester) throw new BadRequestException('No user found');

    const selectionSet = getSelectionSet(info);
    const userSelectionSet = selectionSet
      .filter((field) => field.startsWith('user'))
      .map((field) => field.replace('user.', ''));

    const userData =
      userSelectionSet.length > 0
        ? await this.hasuraService.findByPk('userByPk', userSelectionSet, { id: requester.id })
        : undefined;

    const teamsData = selectionSet.some((field) => field.startsWith('onboardingTeams'))
      ? await this.hasuraService.find(
          'team',
          selectionSet
            .filter((field) => field.startsWith('onboardingTeams'))
            .map((field) => field.replace('onboardingTeams.', '')),
          { expectingPresidentEmail: { _eq: requester.actor.email } },
        )
      : undefined;

    return {
      ...(userData && { user: userData.userByPk }),
      ...(teamsData && { onboardingTeams: teamsData.team }),
      canManageTenant: requester.adminRoles
        .getItems()
        .some((role) =>
          role.tenant === null
            ? role.permissions.includes(AdminPermissions.ManageTenantEntities)
            : role.tenant.id === tenant.id && role.permissions.includes(AdminPermissions.ManageTenantEntities),
        ),
    };
  }
}
