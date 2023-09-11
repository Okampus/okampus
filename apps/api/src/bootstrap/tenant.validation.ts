import { tenantStrategyFactory } from '@okampus/api/bll';
import { Issuer } from 'openid-client';
import type { OIDCCacheService, AuthService } from '@okampus/api/bll';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Authenticator, Strategy } from '@fastify/passport';

type TenantStrategyValidation = {
  oidcCache: OIDCCacheService;
  authService: AuthService;
  fastifyInstance: FastifyInstance;
  fastifyPassport: Authenticator;
};

type TenantValidationParams = { oidcName?: string };

export const tenantStrategyValidation =
  ({ oidcCache, authService, fastifyInstance, fastifyPassport }: TenantStrategyValidation) =>
  async (req: FastifyRequest, res: FastifyReply) => {
    const { oidcName } = req.params as TenantValidationParams;
    if (!oidcName) return false;

    let strategy = oidcCache.strategies.get(oidcName) as Strategy | undefined;
    if (!strategy) {
      const tenant = await authService.findTenantByOidcName(oidcName);
      if (!tenant?.isOidcEnabled) return false;

      const TrustIssuer = await Issuer.discover(tenant.oidcDiscoveryUrl);
      const client = new TrustIssuer.Client({ client_id: tenant.oidcClientId, client_secret: tenant.oidcClientSecret });
      const oidcConfig = { redirect_uri: tenant.oidcCallbackUri, scope: tenant.oidcScopes };
      strategy = tenantStrategyFactory({ authService, oidcName, oidcConfig, client }) as Strategy;
      oidcCache.strategies.set(oidcName, strategy);
    }

    fastifyPassport.authenticate(strategy, { authInfo: false }).bind(fastifyInstance)(req, res);
    return true;
  };

type TenantCallbackValidation = {
  oidcCache: OIDCCacheService;
  authService: AuthService;
  fastifyInstance: FastifyInstance;
  fastifyPassport: Authenticator;
  authenticateOptions: { authInfo: boolean; successRedirect: string };
};

export const tenantCallbackValidation =
  ({ oidcCache, authService, fastifyInstance, fastifyPassport, authenticateOptions }: TenantCallbackValidation) =>
  async (req: FastifyRequest, res: FastifyReply) => {
    const { oidcName } = req.params as TenantValidationParams;
    if (!oidcName) return;

    let strategy = oidcCache.strategies.get(oidcName) as Strategy | undefined;
    if (!oidcCache.strategies.has(oidcName)) {
      const tenant = await authService.findTenantByOidcName(oidcName);
      if (!tenant?.isOidcEnabled) return false;

      const TrustIssuer = await Issuer.discover(tenant.oidcDiscoveryUrl);
      const client = new TrustIssuer.Client({ client_id: tenant.oidcClientId, client_secret: tenant.oidcClientSecret });
      const oidcConfig = { redirect_uri: tenant.oidcCallbackUri, scope: tenant.oidcScopes };
      strategy = tenantStrategyFactory({ authService, oidcName, oidcConfig, client }) as Strategy;
      oidcCache.strategies.set(oidcName, strategy);
    }

    if (!strategy) throw new Error(`Strategy ${oidcName} not found`);
    fastifyPassport.authenticate(strategy, authenticateOptions).bind(fastifyInstance)(req, res);
    return true;
  };
