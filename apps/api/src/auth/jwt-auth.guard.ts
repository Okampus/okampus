import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import type { GqlWebsocketContext } from '../shared/configs/graphql.config';
import { IS_PUBLIC_KEY } from '../shared/lib/constants';
import type { CookiesAuthRequest } from '../shared/lib/types/interfaces/auth-request.interface';
import type { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

export interface Token {
  sub: string;
  aud: string;
}

export interface GqlContext extends GqlWebsocketContext {
  req: CookiesAuthRequest;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  reflector: Reflector;

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
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

    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest<CookiesAuthRequest>();
      request.user = await this.handleRequest(request);
      return Boolean(request.user);
    }
    const { req, context }: GqlContext = GqlExecutionContext.create(ctx).getContext();

    if (context?.headers)
      return Boolean(context.user);

    req.user = await this.handleRequest(req);
    return Boolean(req.user);
  }

  private async handleRequest(request: CookiesAuthRequest): Promise<User> {
    const token = request.signedCookies?.accessToken;
    if (!token)
      throw new UnauthorizedException('Token not provided');

    const decoded = this.jwtService.decode(token) as Token;
    if (!decoded)
      throw new BadRequestException('Failed to decode JWT');

    if (decoded.aud !== 'http')
      throw new UnauthorizedException('Invalid token');

    try {
      await this.jwtService.verifyAsync<Token>(token, this.authService.getTokenOptions('access'));
    } catch {
      throw new UnauthorizedException('Falsified token');
    }

    return await this.userService.findOneById(decoded.sub);
  }
}
