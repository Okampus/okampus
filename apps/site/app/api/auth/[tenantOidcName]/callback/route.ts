import { prisma } from '../../../../../database/prisma/db';
import { createSession } from '../../../../../server/trpc/auth/sessions';
import { createOrConnectTenantUser } from '../../../../../server/trpc/auth/tenant';
import {
  accessCookieOptions,
  baseUrl,
  expiredCookieOptions,
  protocol,
  refreshCookieOptions,
} from '../../../../../config';
import { oauthTokenSecret, sessionSecret } from '../../../../../config/secrets';
import { verifyOptions } from '../../../../../server/trpc/auth/jwt';
import { decrypt } from '../../../../../server/utils/crypto';
import { errorUrl } from '../../../../../utils/error-url';

import { COOKIE_NAMES, EXPIRED_COOKIE, OAUTH_PAYLOAD_COOKIE_NAME } from '@okampus/shared/consts';
import { TokenType, OAuthError } from '@okampus/shared/enums';
import { fromBase64 } from '@okampus/shared/utils';

import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Issuer, TokenSet } from 'openid-client';

import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

function decryptAndVerify(value: string) {
  try {
    return verify(decrypt(value, sessionSecret), oauthTokenSecret, verifyOptions);
  } catch {
    return;
  }
}

type OAuthState = { codeVerifier: string; nonce: string; state: string };
function getOAuthState(cookies: ReadonlyRequestCookies): OAuthState | OAuthError {
  const payloadCookie = cookies.get(OAUTH_PAYLOAD_COOKIE_NAME);
  if (!payloadCookie) return OAuthError.MissingOAuthPayload;

  const payload = decryptAndVerify(payloadCookie.value);
  if (!payload || typeof payload === 'string' || !payload.sub) return OAuthError.InvalidPayload;

  const [state, nonce, codeVerifier] = payload.sub.split(':');
  if (!state || !nonce || !codeVerifier) return OAuthError.InvalidPayload;

  const oidcState = { state: fromBase64(state), nonce: fromBase64(nonce), codeVerifier: fromBase64(codeVerifier) };
  return oidcState;
}

export async function GET(req: Request, { params }: { params: { tenantOidcName: string } }) {
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

  const oidcState = getOAuthState(cookies());

  // Oidc Error
  if (typeof oidcState !== 'object') {
    const response = NextResponse.redirect(errorUrl({ errorCode: oidcState }));
    response.cookies.set(OAUTH_PAYLOAD_COOKIE_NAME, EXPIRED_COOKIE, expiredCookieOptions);
    return response;
  }

  // @ts-expect-error
  const oidcParams = client.callbackParams({ url: req.url, body: req.body, method: req.method });
  let tokenSet: TokenSet;
  try {
    tokenSet = await client.callback(tenant.oidcCallbackUri, oidcParams, {
      response_type: 'code',
      code_verifier: oidcState.codeVerifier,
      nonce: oidcState.nonce,
      state: oidcState.state,
    });
  } catch {
    const response = NextResponse.redirect(errorUrl({ errorCode: OAuthError.IncorrectPayload }));
    response.cookies.set(OAUTH_PAYLOAD_COOKIE_NAME, EXPIRED_COOKIE, expiredCookieOptions);
    return NextResponse.redirect(errorUrl({ errorCode: OAuthError.IncorrectPayload }));
  }

  const userInfo = await client.userinfo(tokenSet);
  const user = await createOrConnectTenantUser(tenant.id, userInfo);
  if (!user) return NextResponse.next({ status: 400 });

  const { id, originalTenantScopeId } = user;
  const { accessToken, refreshToken } = await createSession(req, id.toString(), originalTenantScopeId.toString());

  const frontendUrl = `${protocol}://${tenant.domain}.${baseUrl}`;
  const response = NextResponse.redirect(frontendUrl, { status: 302 });
  response.cookies.set(OAUTH_PAYLOAD_COOKIE_NAME, EXPIRED_COOKIE, expiredCookieOptions);

  response.cookies.set(COOKIE_NAMES[TokenType.Access], accessToken, accessCookieOptions);
  response.cookies.set(COOKIE_NAMES[TokenType.Refresh], refreshToken, refreshCookieOptions);

  return response;
}
