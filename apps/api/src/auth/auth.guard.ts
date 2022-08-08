import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { GqlContextType } from '@nestjs/graphql';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import type { GqlWebsocketContext } from '../shared/configs/graphql.config';
import { IS_PUBLIC_KEY, TENANT_ID_HEADER_NAME } from '../shared/lib/constants';
import type { AuthRequest } from '../shared/lib/types/interfaces/auth-request.interface';
import { TenantsService } from '../tenants/tenants/tenants.service';
import type { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

export interface Token {
  sub: string;
  typ: 'bot' | 'usr';
  aud: string;
}

export interface GqlContext extends GqlWebsocketContext {
  req: AuthRequest;
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

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic)
      return true;

    let request: AuthRequest;
    switch (ctx.getType<GqlContextType>()) {
      case 'http':
        request = ctx.switchToHttp().getRequest<AuthRequest>();
        break;

      case 'graphql': {
        const gqlContext = GqlExecutionContext.create(ctx).getContext<GqlContext>();
        if (gqlContext.context?.headers)
          return Boolean(gqlContext.context.user) && Boolean(gqlContext.context.tenant);

        request = gqlContext.req;
        break;
      }

      default: throw new InternalServerErrorException('Invalid context type');
    }

    const tenantId = request.headers[TENANT_ID_HEADER_NAME.toLowerCase()];
    if (!tenantId)
      return false;

    request.tenant = await this.tenantsService.findOne(
      Array.isArray(tenantId)
      ? tenantId[0]
      : tenantId,
    );

    request.user = await this.handleRequest(request);
    return Boolean(request.user);
  }

  private async handleRequest(request: AuthRequest): Promise<User> {
    let fromHeader = false;

    // Try first to resolve the token from the cookies
    let token = request.signedCookies?.accessToken;
    if (!token) {
      // If not found, try to resolve the bearer from the headers
      const header = request.headers?.authorization?.split(' ');
      if (header?.[0] === 'Bearer' && header?.[1]) {
        token = header[1];
        fromHeader = true;
      }
    }

    if (!token)
      throw new UnauthorizedException('Token not provided');

    const decoded = this.jwtService.decode(token) as Token;
    if (!decoded)
      throw new BadRequestException('Failed to decode JWT');

    if (decoded.aud !== 'http')
      throw new UnauthorizedException('Invalid token');

    if (fromHeader && decoded.typ !== 'bot')
      throw new UnauthorizedException('Non-bot token provided in header');

    try {
      await this.jwtService.verifyAsync<Token>(
        token,
        this.authService.getTokenOptions(decoded.typ === 'usr' ? 'access' : 'bot'),
      );
    } catch {
      throw new UnauthorizedException('Falsified token');
    }

    const user = await this.userService.findOneById(decoded.sub);
    if (user.bot && !(await user.validatePassword(token)))
      throw new UnauthorizedException('Invalid token');

    return user;
  }
}
