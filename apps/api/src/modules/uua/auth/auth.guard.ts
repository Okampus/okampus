import type { IncomingHttpHeaders } from 'node:http';
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
import type { FastifyRequest } from 'fastify';
import type { WebSocket } from 'graphql-ws';
import mapKeys from 'lodash.mapkeys';
import type { GqlWebsocketContext } from '@common/configs/graphql.config';
import { IS_PUBLIC_KEY, TENANT_ID_HEADER_NAME } from '@common/lib/constants';
import type { GlobalRequestContext } from '@common/lib/helpers/global-request-context';
import { RequestType } from '@common/lib/types/enums/request-type.enum';
import { TokenType } from '@common/lib/types/enums/token-type.enum';
import { TenantsService } from '@modules/org/tenants/tenants.service';
import type { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

export interface GqlContext extends GqlWebsocketContext {
  req: FastifyRequest | undefined;
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
  ): { token: string; tenantId: string; tokenType: TokenType } {
    const tenantId = headers[TENANT_ID_HEADER_NAME] as string | undefined;
    if (!tenantId)
      throw new UnauthorizedException('Tenant not provided');

    let token: string;
    let tokenType: TokenType;

    if (cookies === null && headers.authorization) { // WebSocket header case
      token = getTokenFromAuthHeader(headers.authorization);
      tokenType = TokenType.Access;
    } else if (cookies?.accessToken) { // HTTP cookie case
      token = cookies.accessToken;
      tokenType = TokenType.Access;
    } else if (headers.authorization) { // HTTP bearer token case (Bot)
      token = getTokenFromAuthHeader(headers.authorization);
      tokenType = TokenType.Bot;
    } else {
      throw new UnauthorizedException('No token provided');
    }

    return { token, tenantId, tokenType };
  }

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const globalRequestContext = RequestContext.get<GlobalRequestContext>();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    let token: string;
    let tenantId: string;
    let tokenType: TokenType;
    let requestType: RequestType;

    const contextType = ctx.getType<GqlContextType>();

    if (contextType === 'graphql') { // GraphQL or WebSocket case
      const gqlExecutionContext = GqlExecutionContext.create(ctx);
      globalRequestContext.gqlInfo = gqlExecutionContext.getInfo();
      if (isPublic)
        return true;

      const { connectionParams, socket, req } = gqlExecutionContext.getContext<GqlContext>();
      if (socket && connectionParams) { // Websocket case
        const headers = mapKeys(connectionParams, (_, key) => key.toLowerCase()) as IncomingHttpHeaders;
        ({ token, tenantId, tokenType } = this.getAuthInfo(headers, null));
        requestType = RequestType.WebSocket;
      } else { // GraphQL case
        if (!req)
          throw new InternalServerErrorException('No request found in GraphQL context');

        ({ token, tenantId, tokenType } = this.getAuthInfo(req.headers, req.cookies));
        requestType = RequestType.Http;
      }
    } else if (contextType === 'http') { // HTTP case
      requestType = RequestType.Http;
      if (isPublic)
        return true;

      const req = ctx.switchToHttp().getRequest<FastifyRequest>();
      ({ token, tenantId, tokenType } = this.getAuthInfo(req.headers, req.cookies));
    } else {
      throw new InternalServerErrorException(`Unexpected context type: ${contextType}`);
    }

    // TODO: optimize with caching for user session
    globalRequestContext.user = await this.handleRequest(token, requestType, tokenType);
    globalRequestContext.tenant = await this.tenantsService.findOne(tenantId);

    return Boolean(globalRequestContext.user) && Boolean(globalRequestContext.tenant);
  }

  private async handleRequest(
    token: string,
    requestType: RequestType,
    tokenType: TokenType,
  ): Promise<User> {
    const sub = await this.authService.processToken(
      token,
      { requestType },
      this.authService.getTokenOptions(tokenType),
    );

    return await this.userService.findOneById(sub);
  }
}
