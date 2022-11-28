
import type { IncomingHttpHeaders } from 'node:http';
import lower from '@esm2cjs/lowercase-keys';
import { RequestContext } from '@medibloc/nestjs-request-context';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { GqlContextType } from '@nestjs/graphql';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { WebSocket } from 'graphql-ws';
import { config } from '@common/configs/config';
import type { GqlWebsocketContext } from '@common/configs/graphql.config';
import { IS_PUBLIC_KEY, TENANT_ID_HEADER_NAME } from '@common/lib/constants';
import type { GlobalRequestContext } from '@common/lib/helpers/global-request-context';
import { RequestType } from '@common/lib/types/enums/request-type.enum';
import { TokenType } from '@common/lib/types/enums/token-type.enum';
import { addCookiesToResponse } from '@common/lib/utils/add-cookies-to-response';
import { TenantsService } from '@modules/org/tenants/tenants.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

export interface GqlContext extends GqlWebsocketContext {
  req: FastifyRequest | undefined;
  res: FastifyReply | undefined;
  request: FastifyRequest | undefined;
  socket: WebSocket | undefined;
  connectionParams: Record<string, unknown>;
}

const getTokenFromAuthHeader = (authHeader: string): string => {
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token)
    throw new UnauthorizedException('Invalid authorization header');

  return token;
};

@Injectable()
export class AuthGuard implements CanActivate {
  reflector: Reflector;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly tenantsService: TenantsService,
  ) {
    this.reflector = new Reflector();
  }

  public getAuthInfo(
    headers: IncomingHttpHeaders,
    cookies: Record<string, string | undefined> | null,
  ): { token: string; tokenType: Exclude<TokenType, TokenType.MeiliSearch> } {
    let token: string;
    let tokenType: TokenType;

    if (cookies === null && headers.authorization) // WebSocket bearer token case
      ({ token, tokenType } = { token: getTokenFromAuthHeader(headers.authorization), tokenType: TokenType.Access });
    else if (cookies?.[config.cookies.names.access]) // HTTP JWT access token case
      ({ token, tokenType } = { token: cookies[config.cookies.names.access]!, tokenType: TokenType.Access });
    else if (cookies?.[config.cookies.names.refresh]) // HTTP JWT refresh token case
      ({ token, tokenType } = { token: cookies[config.cookies.names.refresh]!, tokenType: TokenType.Refresh });
    else if (headers.authorization) // HTTP bearer token case (Bot)
      ({ token, tokenType } = { token: getTokenFromAuthHeader(headers.authorization), tokenType: TokenType.Bot });
    else
      throw new UnauthorizedException('No token provided');

    return { token, tokenType };
  }

  public async canActivate(host: ExecutionContext): Promise<boolean> {
    const globalRequestContext = RequestContext.get<GlobalRequestContext>();
    globalRequestContext.alreadyPopulated = false;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      host.getHandler(),
      host.getClass(),
    ]);

    let type: RequestType = RequestType.Http;
    let headers: IncomingHttpHeaders | null = null;
    let cookies: Record<string, string | undefined> | null = null;
    let res: FastifyReply | null = null;

    const contextType = host.getType<GqlContextType>();
    if (contextType === 'http') { // HTTP case
      const ctx = host.switchToHttp();

      const req = ctx.getRequest<FastifyRequest>();
      res = ctx.getResponse<FastifyReply>();

      ({ headers, cookies, type } = { headers: req.headers, cookies: req.cookies, type: RequestType.Http });
    } else if (contextType === 'graphql') { // GraphQL or WebSocket case
      const gqlExecutionContext = GqlExecutionContext.create(host);
      globalRequestContext.gqlInfo = gqlExecutionContext.getInfo();

      const { connectionParams, socket, req } = gqlExecutionContext.getContext<GqlContext>();

      if (socket && connectionParams) // WebSocket case
        ({ type, headers } = { type: RequestType.WebSocket, headers: lower(connectionParams) as IncomingHttpHeaders });
      else if (req) // GraphQL case
        ({ headers, cookies, res } = { headers: req.headers, cookies: req.cookies, res: host.getArgByIndex(1) });
      else
        throw new InternalServerErrorException('No request provided in GraphQL context');
    } else {
      throw new InternalServerErrorException(`Unexpected context type: ${contextType}`);
    }

    const tenantId = headers[TENANT_ID_HEADER_NAME] as string | undefined;
    if (tenantId || !isPublic) {
      if (!tenantId)
        throw new UnauthorizedException('No tenant ID provided');

      // TODO: optimize with caching for tenant
      globalRequestContext.tenant = await this.tenantsService.findOne(tenantId);
    }

    if (isPublic)
      return true;

    const { token, tokenType } = this.getAuthInfo(headers, cookies);
    const tokenSignOptions = { secret: config.tokens.secrets[tokenType] };
    const sub = await this.authService.processToken(token, { requestType: type }, tokenSignOptions);

    // TODO: optimize with caching for user session
    globalRequestContext.user = await this.userService.findBareUser(sub);

    // Automatically refresh access tokens if only a refresh token is detected
    if (tokenType === TokenType.Refresh)
      addCookiesToResponse(await this.authService.generateAccessTokens(globalRequestContext.user), res!);

    // Check if token matches bot token (i.e. password)
    if (tokenType === TokenType.Bot) {
      if (!globalRequestContext.user.password)
        throw new UnauthorizedException('Bot token is not set');

      if (!await this.authService.validatePassword(token, globalRequestContext.user.password))
        throw new UnauthorizedException('Invalid bot token');
    }

    return true;
  }
}
