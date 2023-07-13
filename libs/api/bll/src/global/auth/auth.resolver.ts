// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../graphql/hasura.service';
import { Requester } from '../../shards/decorators/requester.decorator';
import { loadConfig } from '../../shards/utils/load-config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ReqTenant } from '../../shards/decorators/tenant.decorator';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { Args, Context, Info, Mutation, Query, Resolver } from '@nestjs/graphql';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Individual, IndividualRepository } from '@okampus/api/dal';
import { TenantPublic } from '@okampus/api/shards';
import { getSelectionSet } from '@okampus/shared/utils';
import { COOKIE_NAMES } from '@okampus/shared/consts';
import { AdminPermissions, TokenExpiration, TokenType } from '@okampus/shared/enums';

import type { Tenant, User } from '@okampus/api/dal';
import type { LoginDto } from './auth.types';
import type { GQLContext } from '../../types/gql-context';
import type { ApiConfig } from '@okampus/shared/types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('User')
export class AuthResolver {
  constructor(
    private readonly individualRepository: IndividualRepository,
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
    @Requester() requester: Individual,
    @ReqTenant() tenant: Tenant,
    @Info() info: GraphQLResolveInfo
  ): Promise<{
    user: User;
    canManageTenant: boolean;
  }> {
    if (!requester.user) throw new BadRequestException('No user found');

    const data = await this.hasuraService.findByPk(
      'userByPk',
      getSelectionSet(info)
        .filter((field) => field.startsWith('user'))
        .map((field) => field.replace('user.', '')),
      { id: requester.user.id }
    );

    const individual = await this.individualRepository.findOneOrFail(
      { id: requester.id },
      { populate: ['adminRoles'] }
    );

    return {
      user: data.userByPk,
      canManageTenant: individual.adminRoles
        .getItems()
        .some((role) =>
          role.tenant === null
            ? role.permissions.includes(AdminPermissions.ManageTenantEntities)
            : role.tenant.id === tenant.id && role.permissions.includes(AdminPermissions.ManageTenantEntities)
        ),
    };
  }
}
