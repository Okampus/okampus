import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { GqlContextType } from '@nestjs/graphql';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';
import type { GraphQLResolveInfo } from 'graphql';
import type { WebSocket } from 'graphql-ws';
import mapKeys from 'lodash.mapkeys';
import type { GqlWebsocketContext } from '@common/configs/graphql.config';
import { IS_PUBLIC_KEY, TENANT_ID_HEADER_NAME } from '@common/lib/constants';
import { processToken } from '@common/lib/utils/process-token';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import { TenantsService } from '@modules/org/tenants/tenants.service';
import type { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

export interface GqlContext extends GqlWebsocketContext {
  req: FastifyRequest & { user: User; tenant: Tenant; gqlInfo: GraphQLResolveInfo } | undefined;
  request: FastifyRequest & { user: User; tenant: Tenant; gqlInfo: GraphQLResolveInfo } | undefined;
  socket: WebSocket | undefined;
  connectionParams: Record<string, unknown>;
}

@Injectable()
export class AuthGuard implements CanActivate {
  reflector: Reflector;

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly tenantsService: TenantsService,
  ) {
    this.reflector = new Reflector();
  }

  public async getTenantFromHeaders(headers: Record<string, string[] | string>): Promise<Tenant> {
    const tenantId = headers[TENANT_ID_HEADER_NAME];
    if (!tenantId)
      throw new UnauthorizedException('Tenant not provided');

    return await this.tenantsService.findOne(Array.isArray(tenantId) ? tenantId[0] : tenantId);
  }

  // TODO: refactor for easier detection of different cases & improved readability
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    const contextType = ctx.getType<GqlContextType>();
    if (!['http', 'graphql'].includes(contextType))
      throw new InternalServerErrorException(`Unexpected context type: ${contextType}`);

    let request: FastifyRequest & { user: User; tenant: Tenant; gqlInfo: GraphQLResolveInfo };
    if (contextType === 'http') {
      if (isPublic)
        return true;

      request = ctx.switchToHttp().getRequest();
    } else { // GraphQL or WebSocket
      const gqlContext = GqlExecutionContext.create(ctx);
      const context = gqlContext.getContext<GqlContext>();

      if (context.request && context.socket && context.connectionParams) { // Websocket case
        if (isPublic)
          return true;

        const headers = mapKeys(context.connectionParams, (_, k) => k.toLowerCase());

        context.request.user = await this.handleWsRequest((headers.authorization as string).split(' ')[1]);
        context.request.tenant = await this.getTenantFromHeaders(headers as Record<string, string[] | string>);
        context.request.gqlInfo = gqlContext.getInfo();

        return Boolean(context.request.user) && Boolean(context.request.tenant);
      }

      if (!context.req)
        throw new UnauthorizedException('No request');

      request = context.req;
      request.gqlInfo = gqlContext.getInfo();
    }

    if (isPublic)
      return true;

    request.tenant = await this.getTenantFromHeaders(request.headers as Record<string, string[] | string>);
    request.user = await this.handleRequest(request);

    return Boolean(request.user) && Boolean(request.tenant);
  }

  private async handleWsRequest(token: string): Promise<User> {
    const sub = await processToken(
      this.jwtService,
      token,
      { tokenType: 'ws' },
      this.authService.getTokenOptions('ws'),
    );

    return await this.userService.findOneById(sub);
  }

  private async handleRequest(request: FastifyRequest & { user: User; tenant: Tenant }): Promise<User> {
    // Try first to resolve the token from the cookies
    let token = request.cookies?.accessToken;
    if (!token) {
      // If not found, try to resolve the bearer from the headers
      const header = request.headers?.authorization?.split(' ');
      if (header?.[0] === 'Bearer' && header?.[1])
        token = header[1];

      if (!token)
        throw new UnauthorizedException('No token provided');
    }

    const sub = await processToken(
      this.jwtService,
      token,
      { tokenType: 'http' },
      this.authService.getTokenOptions('access'),
    );

    const user = await this.userService.findOneById(sub);
    if (user.bot && !(await user.validatePassword(token)))
      throw new UnauthorizedException('Invalid token');

    return user;
  }
}