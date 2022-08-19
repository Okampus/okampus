import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Issuer } from 'openid-client';
import { OIDCStrategyCache } from '../shared/modules/authorization/oidc-strategy.cache';
import { TenantsService } from '../tenants/tenants/tenants.service';
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

    if (!this.oidcStrategyCache.strategies.has(tenantId)) {
      const TrustIssuer = await Issuer.discover(oidcDiscoveryUrl!);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const client = new TrustIssuer.Client({ client_id: oidcClientId!, client_secret: oidcClientSecret! });
      this.oidcStrategyCache.strategies.set(tenantId, tenantStrategyFactory(
        this.authServiceInstance,
        tenantId,
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          redirect_uri: oidcCallbackUri!,
          scope: oidcScopes!,
        },
        client,
      ));
    }
    const guard = new (AuthGuard(tenantId))();
    return await guard.canActivate(context) as boolean;
  }
}
