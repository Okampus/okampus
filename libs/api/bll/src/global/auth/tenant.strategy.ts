import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'openid-client';
import { toTitleCase } from '@okampus/shared/utils';

import type { AuthService } from './auth.service';
import type { User } from '@okampus/api/dal';
import type { Client, TokenSet } from 'openid-client';
import type { TenantUserResponse } from '@okampus/shared/types';

type Config = { redirect_uri: string; scope: string };
type Props = { authService: AuthService; oidcName: string; client: Client; oidcConfig: Config };
export function tenantStrategyFactory({ authService, oidcName, oidcConfig, client }: Props): Strategy<User> {
  const TenantStrategy = class extends PassportStrategy(Strategy, oidcName) {
    constructor(
      private readonly authService: AuthService,
      private readonly client: Client,
      oidcConfig: Config,
    ) {
      super({ client, params: oidcConfig, usePKCE: false });
    }

    public async validate(tokenset: TokenSet): Promise<User> {
      const data: TenantUserResponse = await this.client.userinfo(tokenset);

      const [firstName, ...middleNames] = data.given_name.split(' ');

      const createUser = {
        name: `${firstName} ${data.family_name}`,
        slug: data.sub,
        firstName,
        middleNames,
        lastName: toTitleCase(data.family_name),
        email: data.email,
        tenantScope: await this.authService.findTenantByOidcName(oidcName),
        createdBy: null,
      };

      try {
        return await this.authService.findUserBySlug(createUser.slug);
      } catch {
        return await this.authService.createUser(createUser);
      }
    }
  };

  return new TenantStrategy(authService, client, oidcConfig);
}
