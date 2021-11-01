import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { User } from '../users/user.schema';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';

export interface Client {
  signedCookies: Record<string, string>;
  user: User;
}

export interface Token {
  sub: string;
  username: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  reflector: Reflector;

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.reflector = new Reflector();
  }

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const client: Client = ctx.switchToHttp().getRequest();
    client.user = await this.handleRequest(client);
    return client.user !== null;
  }

  private async handleRequest(client: Client): Promise<User> {
    const token = client.signedCookies?.accessToken;
    if (!token)
      throw new BadRequestException('Token not provided');

    const decoded = this.jwtService.decode(token) as Token;
    if (!decoded)
      throw new BadRequestException('Failed to decode JWT');

    try {
      await this.jwtService.verifyAsync<Token>(token, this.authService.getAccessTokenOptions());
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return await this.userService.validateUserById(decoded.sub);
  }
}
