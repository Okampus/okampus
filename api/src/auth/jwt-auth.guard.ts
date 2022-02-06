import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../shared/lib/constants';
import type { HorizonRequest } from '../shared/lib/types/horizon-request.interface';
import type { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

export interface Token {
  sub: string;
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

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic)
      return true;

    const request = context.switchToHttp().getRequest<HorizonRequest>();
    request.user = await this.handleRequest(request);
    return request.user !== null;
  }

  private async handleRequest(request: HorizonRequest): Promise<User> {
    const token = request.signedCookies?.accessToken;
    if (!token)
      throw new UnauthorizedException('Token not provided');

    const decoded = this.jwtService.decode(token) as Token;
    if (!decoded)
      throw new BadRequestException('Failed to decode JWT');

    try {
      await this.jwtService.verifyAsync<Token>(token, this.authService.getTokenOptions('access'));
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return await this.userService.findOneById(decoded.sub);
  }
}
