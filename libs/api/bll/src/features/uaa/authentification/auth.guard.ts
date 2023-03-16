// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../../global/config.module';

import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenType } from '@okampus/shared/enums';
import { IS_PUBLIC, IS_TENANT_PUBLIC } from '@okampus/api/shards';
import { HEADER_TENANT_NAME } from '@okampus/shared/consts';
import { lowercaseKeys } from '@okampus/shared/utils';
import { requestContext } from '@fastify/request-context';
import type { IncomingHttpHeaders } from 'node:http';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { GqlContextType } from '@nestjs/graphql';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { WebSocket } from 'graphql-ws';
import type { ApiConfig } from '@okampus/shared/types';
import type { GqlWebsocketContext } from '../../../shards/types/gql-websocket-context.type';

export interface GqlContext extends GqlWebsocketContext {
  req: FastifyRequest | undefined;
  reply: FastifyReply | undefined;
  request: FastifyRequest | undefined;
  socket: WebSocket | undefined;
  connectionParams: Record<string, string | string[] | undefined>;
}

const getTokenFromAuthHeader = (authHeader: string): string => {
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) throw new UnauthorizedException('Invalid authorization header');

  return token;
};

type Cookies = Record<string, string | undefined> | null;

type AuthRequestContext = {
  headers: IncomingHttpHeaders;
  cookies: Cookies;
  reply: FastifyReply | null;
  req: FastifyRequest | null;
};

type AuthInfo = {
  token: string;
  tokenType: Exclude<TokenType, TokenType.MeiliSearch>;
};

@Injectable()
export class AuthGuard implements CanActivate {
  issuer: string;
  reflector: Reflector;
  cookiesNames: {
    access: ApiConfig['cookies']['names'][TokenType.Access];
    refresh: ApiConfig['cookies']['names'][TokenType.Refresh];
  };

  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    this.reflector = new Reflector();

    this.issuer = this.configService.config.tokens.issuer;
    this.cookiesNames = {
      access: this.configService.config.cookies.names[TokenType.Access],
      refresh: this.configService.config.cookies.names[TokenType.Refresh],
    };
  }

  public getRequestContext(host: ExecutionContext): AuthRequestContext {
    const contextType = host.getType<GqlContextType>();
    switch (contextType) {
      case 'http': {
        // HTTP case
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<FastifyRequest>();
        const reply = ctx.getResponse<FastifyReply>();

        return { headers: req.headers, cookies: req.cookies, reply, req };
      }
      case 'graphql': {
        // GraphQL or WebSocket case
        const gqlExecutionContext = GqlExecutionContext.create(host);
        requestContext.set('gqlInfo', gqlExecutionContext.getInfo());

        const { req, reply, connectionParams, socket } = gqlExecutionContext.getContext<GqlContext>();

        // WebSocket case
        if (socket && connectionParams) {
          const headers = lowercaseKeys(connectionParams);
          return { headers, cookies: null, reply: null, req: null };
        }
        // GraphQL case
        if (req && reply) {
          return { headers: req.headers, cookies: req.cookies, reply, req };
        }

        throw new InternalServerErrorException('No request provided in GraphQL context');
      }
      default: {
        throw new InternalServerErrorException(`Unexpected context type: ${contextType}`);
      }
    }
  }

  public getAuthInfo(headers: IncomingHttpHeaders, cookies: Cookies): AuthInfo {
    const accessToken = cookies?.[this.cookiesNames.access];
    const refreshToken = cookies?.[this.cookiesNames.refresh];
    if (accessToken) return { token: accessToken, tokenType: TokenType.Access }; // HTTP JWT access token case
    else if (refreshToken) return { token: refreshToken, tokenType: TokenType.Refresh }; // HTTP JWT refresh token case
    else if (headers.authorization) {
      // WebSocket / Bot bearer token case
      const token = getTokenFromAuthHeader(headers.authorization);
      return cookies === null ? { token, tokenType: TokenType.WebSocket } : { token, tokenType: TokenType.Bot };
    }

    throw new UnauthorizedException('No token provided');
  }

  public async canActivate(host: ExecutionContext): Promise<boolean> {
    /* Init context */
    const targets = [host.getHandler(), host.getClass()];
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, targets);
    if (isPublic) return true;

    const { headers, cookies, reply, req } = this.getRequestContext(host);

    /* Find tenant */
    const tenantDomain = headers[HEADER_TENANT_NAME] as string | undefined;
    if (!tenantDomain) throw new UnauthorizedException('No tenant name provided');

    // TODO: optimize with caching for tenant & individual
    const tenant = await this.authService.findCoreTenant(tenantDomain);
    if (!tenant) throw new UnauthorizedException('Tenant does not exist');
    requestContext.set('tenant', tenant);

    const isTenantPublic = this.reflector.getAllAndOverride<boolean>(IS_TENANT_PUBLIC, targets);
    if (isTenantPublic) return true;

    /* Get individual */
    const { token, tokenType } = this.getAuthInfo(headers, cookies);

    /* Bot token case */
    if (tokenType === TokenType.Bot) {
      requestContext.set('requester', await this.authService.validateBotToken(token));
      return true;
    }

    if (!req || !reply) throw new InternalServerErrorException('No request provided in GraphQL context');
    const user = await this.authService.validateUserToken(token, tokenType, req, reply);
    requestContext.set('requester', user);
    return true;
  }
}
