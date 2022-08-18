import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { BaseClient, Client, TokenSet } from 'openid-client';
import { Strategy } from 'openid-client';
import type { TenantUserinfoResponse } from '../shared/lib/types/interfaces/userinfo-response.interface';
import { SchoolRole } from '../shared/modules/authorization/types/school-role.enum';
import type { User } from '../users/user.entity';
import type { AuthService } from './auth.service';
import { TenantDto } from './dto/tenant.dto';

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

      if (!Object.values<string>(SchoolRole).includes(data.role))
        throw new UnauthorizedException('Invalid role');

      const userInfo = new TenantDto(data);

      return await this.authService.createOrUpdate(tenantId, userInfo);
    }
  };

  return new TenantStrategy(authServiceInstance, paramsOptions, oidcClient);
}
