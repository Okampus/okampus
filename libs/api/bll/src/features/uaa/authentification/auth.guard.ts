import type { IncomingHttpHeaders } from 'node:http';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { GqlContextType } from '@nestjs/graphql';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { WebSocket } from 'graphql-ws';
import { AuthService } from './auth.service';
import { TokenType } from '@okampus/shared/enums';
import { IS_PUBLIC, IS_TENANT_PUBLIC } from '@okampus/api/shards';
import { ConfigService } from '../../../global/config.module';
import { ApiConfig } from '@okampus/shared/types';
import { GqlWebsocketContext } from '../../../shards/types/gql-websocket-context.type';
import { HEADER_TENANT_NAME } from '@okampus/shared/consts';
import { lowercaseKeys } from '@okampus/shared/utils';
import { requestContext } from '@fastify/request-context';

export interface GqlContext extends GqlWebsocketContext {
  req: FastifyRequest | undefined;
  res: FastifyReply | undefined;
  request: FastifyRequest | undefined;
  socket: WebSocket | undefined;
  connectionParams: Record<string, unknown>;
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
  res: FastifyReply | null;
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
        const res = ctx.getResponse<FastifyReply>();

        return { headers: req.headers, cookies: req.cookies, res, req };
      }
      case 'graphql': {
        // GraphQL or WebSocket case
        const gqlExecutionContext = GqlExecutionContext.create(host);
        requestContext.set('gqlInfo', gqlExecutionContext.getInfo());

        const { req, connectionParams, socket } = gqlExecutionContext.getContext<GqlContext>();

        // WebSocket case
        if (socket && connectionParams) {
          const headers = lowercaseKeys(connectionParams) as IncomingHttpHeaders;
          return { headers, cookies: null, res: null, req: null };
        }
        // GraphQL case
        if (req) {
          const res = host.getArgByIndex(1) as FastifyReply;
          return { headers: req.headers, cookies: req.cookies, res, req };
        }

        throw new InternalServerErrorException('No request provided in GraphQL context');
      }
      default: {
        throw new InternalServerErrorException(`Unexpected context type: ${contextType}`);
      }
    }
  }

  public getAuthInfo(headers: IncomingHttpHeaders, cookies: Cookies): AuthInfo {
    if (cookies && cookies[this.cookiesNames.access])
      // HTTP JWT access token case
      return { token: cookies[this.cookiesNames.access] as string, tokenType: TokenType.Access };
    else if (cookies && cookies[this.cookiesNames.refresh])
      // HTTP JWT refresh token case
      return { token: cookies[this.cookiesNames.refresh] as string, tokenType: TokenType.Refresh };
    else if (cookies === null && headers.authorization)
      // WebSocket bearer token case
      return { token: getTokenFromAuthHeader(headers.authorization), tokenType: TokenType.WebSocket };
    else if (headers.authorization)
      // HTTP bearer token case (Bot)
      return { token: getTokenFromAuthHeader(headers.authorization), tokenType: TokenType.Bot };

    throw new UnauthorizedException('No token provided');
  }

  public async canActivate(host: ExecutionContext): Promise<boolean> {
    /* Init context */
    const targets = [host.getHandler(), host.getClass()];
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, targets);
    if (isPublic) return true;

    const { headers, cookies, res, req } = this.getRequestContext(host);

    /* Find tenant */
    const tenantDomain = headers[HEADER_TENANT_NAME] as string | undefined;
    if (!tenantDomain) throw new UnauthorizedException('No tenant ID provided');

    // TODO: optimize with caching for tenant

    const tenant = await this.authService.findCoreTenant(tenantDomain);

    if (!tenant) throw new UnauthorizedException('Tenant does not exist');
    requestContext.set('tenant', tenant);

    const isTenantPublic = this.reflector.getAllAndOverride<boolean>(IS_TENANT_PUBLIC, targets);
    if (isTenantPublic) return true;

    /* Find user */
    const { token, tokenType } = this.getAuthInfo(headers, cookies);

    // TODO: optimize with caching for individual

    // Bot token case - check if token matches bot token
    if (tokenType === TokenType.Bot) {
      requestContext.set('requester', await this.authService.validateBotToken(token));
      return true;
    }

    const user = await this.authService.validateUserToken(token, tokenType, req as FastifyRequest, res as FastifyReply);
    requestContext.set('requester', user);
    return true;
  }
}
