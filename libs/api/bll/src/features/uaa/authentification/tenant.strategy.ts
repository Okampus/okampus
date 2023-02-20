import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'openid-client';
import { capitalize, enumChecker } from '@okampus/shared/utils';
import { ScopeRole } from '@okampus/shared/enums';
import type { Client, TokenSet } from 'openid-client';
import type { TenantUserResponse } from '@okampus/shared/types';
import type { User } from '@okampus/api/dal';
import type { UsersService } from '../../../domains/resources/users/users.service';
import type { UserModel } from '../../../domains/factories/domains/users/user.model';

export function tenantStrategyFactory(
  usersService: UsersService,
  tenantSlug: string,
  paramsOptions: { redirect_uri: string; scope: string },
  oidcClient: Client
): Strategy<User> {
  const TenantStrategy = class extends PassportStrategy(Strategy, tenantSlug) {
    constructor(
      private readonly usersService: UsersService,
      private readonly client: Client,
      params: { redirect_uri: string; scope: string }
    ) {
      super({ client, params, usePKCE: false });
    }

    public async validate(tokenset: TokenSet): Promise<UserModel> {
      const data: TenantUserResponse = await this.client.userinfo(tokenset);
      const role = capitalize(data.role);

      if (!enumChecker(ScopeRole)(role)) throw new UnauthorizedException('Invalid role');

      const [firstName, ...middleNames] = data.given_name.split(' ');
      const createUser = {
        slug: data.sub,
        firstName,
        middleNames,
        lastName: data.family_name,
        primaryEmail: data.email,
        scopeRole: role,
      };

      try {
        return await this.usersService.findOneBySlug(createUser.slug);
      } catch {
        return await this.usersService.create(createUser);
      }
    }
  };

  return new TenantStrategy(usersService, oidcClient, paramsOptions);
}
