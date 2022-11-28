import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import capitalize from 'lodash.capitalize';
import type { BaseClient, Client, TokenSet } from 'openid-client';
import { Strategy } from 'openid-client';
import type { TenantUserinfoResponse } from '@common/lib/types/interfaces/userinfo-response.interface';
import { ScopeRole } from '@common/modules/authorization/types/scope-role.enum';
import type { User } from '../users/user.entity';
import type { AuthService } from './auth.service';
import { TenantUserDto } from './dto/tenant-user.dto';

export function tenantStrategyFactory(
  authServiceInstance: AuthService,
  tenantId: string,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  paramsOptions: { redirect_uri: string; scope: string },
  oidcClient: Client,
): Strategy<User> {
  const TenantStrategy = class extends PassportStrategy(Strategy, tenantId) {
    private readonly client: BaseClient;

    constructor(
      private readonly authService: AuthService,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      params: { redirect_uri: string; scope: string },
      client: Client,
    ) {
      super({
        client,
        params,
        usePKCE: false,
      });
      this.client = client;
    }

    public async validate(tokenset: TokenSet): Promise<User> {
      const data: TenantUserinfoResponse = await this.client.userinfo(tokenset);

      if (!Object.values<string>(ScopeRole).includes(capitalize(data.role)))
        throw new UnauthorizedException('Invalid role');

      const userInfo = new TenantUserDto(data);

      return await this.authService.createOrUpdate(userInfo, tenantId);
    }
  };

  return new TenantStrategy(authServiceInstance, paramsOptions, oidcClient);
}
