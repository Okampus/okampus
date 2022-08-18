import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { Strategy } from 'openid-client';
import { Issuer } from 'openid-client';
import { TenantsService } from 'src/tenants/tenants/tenants.service';
import { OIDCStrategyCache } from '../shared/modules/authorization/oidc-strategy.cache';
import type { Tenant } from '../tenants/tenants/tenant.entity';
import type { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { tenantStrategyFactory } from './tenant.strategy';

@Injectable()
export class TenantOidcAuthGuard implements CanActivate {
  reflector: Reflector;

  constructor(
    private readonly oidcStrategyCache: OIDCStrategyCache,
    private readonly authServiceInstance: AuthService,
    private readonly tenantsSerice: TenantsService,
  ) {
    this.reflector = new Reflector();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.params.id as string;
    const tenant = await this.tenantsSerice.findOne(tenantId);
    if (!tenant)
      return false;

    const {
      oidcEnabled,
      oidcClientId,
      oidcClientSecret,
      oidcDiscoveryUrl,
      oidcScopes,
      oidcCallbackUri,
    } = tenant;

    if (!oidcEnabled)
      return false;

    let strategy: Strategy<User>;

    if (this.oidcStrategyCache.strategies.get(tenantId)) {
      strategy = this.oidcStrategyCache.strategies.get(tenantId)!;
    } else {
      const TrustIssuer = await Issuer.discover(oidcDiscoveryUrl!);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const client = new TrustIssuer.Client({ client_id: oidcClientId!, client_secret: oidcClientSecret! });
      strategy = tenantStrategyFactory(
        this.authServiceInstance,
        tenantId,
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          redirect_uri: oidcCallbackUri!,
          scope: oidcScopes!,
        },
        client,
      );
      this.oidcStrategyCache.strategies.set(tenantId, strategy);
    }
    // Reference
    const guard = new (AuthGuard(tenantId))();
    return await guard.canActivate(context) as boolean;
  }
}
// @Injectable()
// export class OIDCAuthGuard extends AuthGuard('oidc') {}
