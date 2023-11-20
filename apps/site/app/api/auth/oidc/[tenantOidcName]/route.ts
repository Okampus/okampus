import { issuer } from '../../../../../config';
import { oauthCookieOptions, oauthTokenSecret } from '../../../../../server/secrets';
import prisma from '../../../../../database/prisma/db';
import { errorUrl } from '../../../../../utils/error-url';

import { OAUTH_PAYLOAD_COOKIE_NAME } from '@okampus/shared/consts';
import { OAuthError } from '@okampus/shared/enums';
import { toBase64 } from '@okampus/shared/utils';

import * as jose from 'jose';

import { NextResponse } from 'next/server';
import { Issuer, generators } from 'openid-client';

async function signAndEncrypt(state: string, nonce: string, codeVerifier: string) {
  const sub = `${toBase64(state)}:${toBase64(nonce)}:${toBase64(codeVerifier)}`;
  return await new jose.EncryptJWT({ sub })
    .setIssuedAt()
    .setExpirationTime('2m')
    .setIssuer(issuer)
    .encrypt(oauthTokenSecret);
}

export async function GET(_request: Request, { params }: { params: { tenantOidcName: string } }) {
  const { tenantOidcName } = params;
  if (!tenantOidcName || Array.isArray(tenantOidcName)) return NextResponse.next({ status: 400 });
  const tenant = await prisma.tenant.findFirst({ where: { oidcName: tenantOidcName } });

  if (!tenant) return NextResponse.redirect(errorUrl({ errorCode: OAuthError.TenantDoesNotExist }));
  if (!tenant.isOidcEnabled)
    return NextResponse.redirect(errorUrl({ errorCode: OAuthError.NoAuth, domain: tenant.domain }));

  const tenantIssuer = await Issuer.discover(tenant.oidcDiscoveryUrl);
  const client = new tenantIssuer.Client({
    client_id: tenant.oidcClientId,
    client_secret: tenant.oidcClientSecret,
    redirect_uris: [tenant.oidcCallbackUri],
    response_types: ['code'],
  });

  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);
  const nonce = generators.nonce();
  const state = generators.state();

  const scope = tenant.oidcScopes || 'openid profile email';
  const authorizationUrl = client.authorizationUrl({
    scope,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    nonce,
    state,
  });

  const response = NextResponse.redirect(authorizationUrl, { status: 302 });

  response.cookies.set(OAUTH_PAYLOAD_COOKIE_NAME, await signAndEncrypt(state, nonce, codeVerifier), oauthCookieOptions);
  return NextResponse.redirect(authorizationUrl);
}
