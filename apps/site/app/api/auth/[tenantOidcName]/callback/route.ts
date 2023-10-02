import { prisma } from '../../../../../database/prisma/db';
import { createSession } from '../../../../../server/trpc/auth/sessions';
import { createOrConnectTenantUser } from '../../../../../server/trpc/auth/tenant';
import { accessCookieOptions, refreshCookieOptions } from '../../../../../config';

import { COOKIE_NAMES } from '@okampus/shared/consts';
import { TokenType } from '@okampus/shared/enums';

import { NextResponse } from 'next/server';
import { Issuer, generators } from 'openid-client';

export async function GET(req: Request, { params }: { params: { tenantOidcName: string } }) {
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

  // @ts-expect-error
  const oidcParams = client.callbackParams({ url: req.url, body: req.body, method: req.method });
  const tokenSet = await client.callback(tenant.oidcCallbackUri, oidcParams, { code_verifier: codeVerifier });

  const userInfo = await client.userinfo(tokenSet);
  const user = await createOrConnectTenantUser(tenant.id, userInfo);
  if (!user) return NextResponse.next({ status: 400 });

  const { id } = user;

  const { accessToken, refreshToken } = await createSession(req, id.toString());

  const frontendUrl =
    process.env.NODE_ENV === 'production' ? `https://${tenant.domain}.okampus.fr` : 'http://localhost:3000';
  const response = NextResponse.redirect(frontendUrl, { status: 303 });
  response.cookies.set(COOKIE_NAMES[TokenType.Access], accessToken, accessCookieOptions);
  response.cookies.set(COOKIE_NAMES[TokenType.Refresh], refreshToken, refreshCookieOptions);

  return response;
}
