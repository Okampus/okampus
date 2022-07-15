import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../shared/lib/constants';
import type { CookiesAuthRequest, HeaderAuthRequest } from '../shared/lib/types/interfaces/auth-request.interface';
import type { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import type { Token } from './jwt-auth.guard';

@Injectable()
export class WsAuthGuard implements CanActivate {
  reflector: Reflector;

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {
    this.reflector = new Reflector();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic)
      return true;

    const request: HeaderAuthRequest = context.getType() === 'http'
      ? context.switchToHttp().getRequest<CookiesAuthRequest>()
      : GqlExecutionContext.create(context).getContext().req;
    request.user = await this.handleRequest(request);
    return request.user !== null;
  }

  private async handleRequest(request: HeaderAuthRequest): Promise<User> {
    const token = request.headers?.authorization;
    if (!token)
      throw new UnauthorizedException('Token not provided');

    const decoded = this.jwtService.decode(token) as Token;
    if (!decoded)
      throw new BadRequestException('Failed to decode JWT');

    if (decoded.aud !== 'ws')
      throw new UnauthorizedException('Invalid token');


    try {
      await this.jwtService.verifyAsync<Token>(token, this.authService.getTokenOptions('ws'));
    } catch {
      throw new UnauthorizedException('Falsified token');
    }

    return await this.userService.findOneById(decoded.sub);
  }
}
