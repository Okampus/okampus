import { prisma } from '../../../../../database/prisma/db';
import { NextResponse } from 'next/server';
import { Issuer, generators } from 'openid-client';

export async function GET(_req: Request, { params }: { params: { tenantOidcName: string } }) {
  const { tenantOidcName } = params;
  if (!tenantOidcName || Array.isArray(tenantOidcName)) return NextResponse.next({ status: 400 });
  const tenant = await prisma.tenant.findFirst({ where: { oidcName: tenantOidcName } });

  if (!tenant?.isOidcEnabled) return NextResponse.next({ status: 404 });

  const tenantIssuer = await Issuer.discover(tenant.oidcDiscoveryUrl);
  const client = new tenantIssuer.Client({
    client_id: tenant.oidcClientId,
    client_secret: tenant.oidcClientSecret,
    redirect_uris: [tenant.oidcCallbackUri],
    response_types: ['code'],
  });

  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const scope = tenant.oidcScopes || 'openid profile email';
  const authorizationUrl = client.authorizationUrl({
    scope,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return NextResponse.redirect(authorizationUrl);
}
