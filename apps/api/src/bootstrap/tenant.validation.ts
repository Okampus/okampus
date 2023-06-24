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

function getTenant(req: FastifyRequest) {
  if (req.params && typeof req.params === 'object' && 'tenant' in req.params && typeof req.params.tenant === 'string')
    return req.params.tenant;
  return null;
}

export const tenantStrategyValidation =
  ({ oidcCache, authService, fastifyInstance, fastifyPassport }: TenantStrategyValidation) =>
  async (req: FastifyRequest, res: FastifyReply) => {
    const domain = getTenant(req);
    if (!domain) return false;

    const tenant = await authService.findTenant(domain);
    if (!tenant) return false;

    if (!oidcCache.strategies.has(domain)) {
      if (
        !tenant.isOidcEnabled ||
        !tenant.oidcClientId ||
        !tenant.oidcClientSecret ||
        !tenant.oidcDiscoveryUrl ||
        !tenant.oidcScopes ||
        !tenant.oidcCallbackUri
      )
        return false;

      const TrustIssuer = await Issuer.discover(tenant.oidcDiscoveryUrl);
      const client = new TrustIssuer.Client({ client_id: tenant.oidcClientId, client_secret: tenant.oidcClientSecret });
      const oidcConfig = { redirect_uri: tenant.oidcCallbackUri, scope: tenant.oidcScopes };
      const strategy = tenantStrategyFactory({ authService, tenantSlug: domain, oidcConfig, client });
      oidcCache.strategies.set(domain, strategy);
    }

    const strategy = oidcCache.strategies.get(domain) as Strategy;
    await fastifyPassport.authenticate(strategy, { authInfo: false }).bind(fastifyInstance)(req, res);

    return true;
  };

type TenantCallbackValidation = {
  oidcCache: OIDCCacheService;
  fastifyInstance: FastifyInstance;
  fastifyPassport: Authenticator;
  authenticateOptions: { authInfo: boolean; successRedirect: string };
};

export const tenantCallbackValidation =
  ({ oidcCache, fastifyInstance, fastifyPassport, authenticateOptions }: TenantCallbackValidation) =>
  async (req: FastifyRequest, res: FastifyReply) => {
    const tenantSlug = getTenant(req);
    if (!tenantSlug) return;

    const strategy = oidcCache.strategies.get(tenantSlug) as Strategy;
    await fastifyPassport.authenticate(strategy, authenticateOptions).bind(fastifyInstance)(req, res);
  };
