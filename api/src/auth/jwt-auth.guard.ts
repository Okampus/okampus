import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { User } from '../users/user.schema';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';

export interface Client {
  headers: Record<string, string>;
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
    const token = this.getToken(client);

    const decoded = this.jwtService.decode(token) as Token;
    if (!decoded)
      throw new BadRequestException('Failed to decode jwt');

    try {
      await this.jwtService.verifyAsync<Token>(token, this.authService.getAccessTokenOptions());
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return await this.userService.validateUserById(decoded.sub);
  }

  private getToken(client: Client): string {
    const authorization = client.headers.authorization?.split(' ');
    if (!authorization)
      throw new UnauthorizedException('Token not found');

    if (authorization[0].toLowerCase() !== 'bearer')
      throw new UnauthorizedException('Authorization type not valid');

    if (!authorization[1])
      throw new UnauthorizedException('Token not provided');

    return authorization[1];
  }
}
