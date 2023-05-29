import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'openid-client';
import { capitalize, enumChecker, toTitleCase } from '@okampus/shared/utils';
import { ScopeRole } from '@okampus/shared/enums';

import type { AuthService } from './auth.service';
import type { Individual } from '@okampus/api/dal';
import type { Client, TokenSet } from 'openid-client';
import type { TenantUserResponse } from '@okampus/shared/types';

type Config = { redirect_uri: string; scope: string };
type Props = { authService: AuthService; tenantSlug: string; client: Client; oidcConfig: Config };
export function tenantStrategyFactory({ authService, tenantSlug, oidcConfig, client }: Props): Strategy<Individual> {
  const TenantStrategy = class extends PassportStrategy(Strategy, tenantSlug) {
    constructor(private readonly authService: AuthService, private readonly client: Client, oidcConfig: Config) {
      super({ client, params: oidcConfig, usePKCE: false });
    }

    public async validate(tokenset: TokenSet): Promise<Individual> {
      const tenant = await this.authService.findTenant(tenantSlug);

      const data: TenantUserResponse = await this.client.userinfo(tokenset);
      const scopeRole = capitalize(data.role);

      if (!enumChecker(ScopeRole)(scopeRole)) throw new UnauthorizedException('Invalid role');

      const [firstName, ...middleNames] = data.given_name.split(' ');
      const user = { firstName, middleNames, lastName: toTitleCase(data.family_name) };
      const name = `${user.firstName} ${user.lastName}`;

      const createUser = { name, slug: data.sub, user, primaryEmail: data.email, scopeRole, tenant, createdBy: null };

      try {
        return await this.authService.findUserBySlug(createUser.slug);
      } catch {
        return await this.authService.createUser(createUser);
      }
    }
  };

  return new TenantStrategy(authService, client, oidcConfig);
}
