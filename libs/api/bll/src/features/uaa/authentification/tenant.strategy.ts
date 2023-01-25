import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { BaseClient, Client, TokenSet } from 'openid-client';
import { Strategy } from 'openid-client';
import { TenantUserDto } from './dto/tenant-user.dto';
import { capitalize } from '@okampus/shared/utils';
import { TenantUserinfoResponse } from '@okampus/shared/types';
import { User } from '@okampus/api/dal';
import { ScopeRole } from '@okampus/shared/enums';
import { UsersService } from '../../../domains/resources/users/users.service';
import { UserModel } from '../../../domains/factories/users/user.model';

export function tenantStrategyFactory(
  usersService: UsersService,
  tenantSlug: string,
  paramsOptions: { redirect_uri: string; scope: string },
  oidcClient: Client
): Strategy<User> {
  const TenantStrategy = class extends PassportStrategy(Strategy, tenantSlug) {
    private readonly client: BaseClient;

    constructor(
      private readonly usersService: UsersService,
      params: { redirect_uri: string; scope: string },
      client: Client
    ) {
      super({
        client,
        params,
        usePKCE: false,
      });
      this.client = client;
    }

    public async validate(tokenset: TokenSet): Promise<UserModel> {
      const data: TenantUserinfoResponse = await this.client.userinfo(tokenset);

      if (!Object.values<string>(ScopeRole).includes(capitalize(data.role)))
        throw new UnauthorizedException('Invalid role');

      const userInfo = new TenantUserDto(data as Required<TenantUserinfoResponse>);
      return await this.usersService.create(userInfo);
    }
  };

  return new TenantStrategy(usersService, paramsOptions, oidcClient);
}
