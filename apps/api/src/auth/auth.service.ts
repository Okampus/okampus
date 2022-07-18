import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { config } from '../shared/configs/config';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import type { MyEfreiDto } from './dto/myefrei.dto';
import type { Token } from './jwt-auth.guard';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validatePassword(userQuery: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      $or: [
        { id: { $ilike: userQuery } },
        { email: userQuery.toLowerCase() },
      ],
    });
    if (user) {
      const userPassword = this.userRepository.createQueryBuilder().select('password').where({ id: user.id });
      if (!userPassword)
        throw new BadRequestException('Password is not set');
      if (!(await user.validatePassword(password)))
        throw new UnauthorizedException('Invalid credentials');

      return user;
    }
    throw new BadRequestException('Invalid credentials');
  }

  public async login(user: User): Promise<TokenResponse> {
    const payload: Token = { sub: user.id, aud: 'http' };

    return {
      accessToken: await this.jwtService.signAsync(payload, this.getTokenOptions('access')),
      refreshToken: config.get('tokens.accessTokenExpirationSeconds')
        ? await this.jwtService.signAsync(payload, this.getTokenOptions('refresh'))
        : null,
      accessTokenExpiresAt: Date.now() + config.get('tokens.accessTokenExpirationSeconds') * 1000,
      refreshTokenExpiresAt: Date.now() + config.get('tokens.refreshTokenExpirationSeconds') * 1000,
    };
  }

  public async getWsToken(id: string): Promise<string> {
    return await this.jwtService.signAsync({ sub: id, aud: 'ws' }, this.getTokenOptions('ws'));
  }

  public async loginWithRefreshToken(refreshToken: string): Promise<TokenResponse> {
    const decoded = this.jwtService.decode(refreshToken) as Token;
    if (!decoded)
      throw new BadRequestException('Failed to decode JWT');

    if (decoded.aud !== 'http')
      throw new UnauthorizedException('Invalid token');

    try {
      await this.jwtService.verifyAsync<Token>(refreshToken, this.getTokenOptions('refresh'));
    } catch {
      throw new UnauthorizedException('Falsified token');
    }

    const user = await this.userRepository.findOneOrFail({ id: decoded.sub });
    return this.login(user);
  }

  public async getWsTokenWithAccessToken(accessToken: string): Promise<string> {
    const decoded = this.jwtService.decode(accessToken) as Token;
    if (!decoded)
      throw new BadRequestException('Failed to decode JWT');

    if (decoded.aud !== 'http')
      throw new UnauthorizedException('Invalid token');

    try {
      await this.jwtService.verifyAsync<Token>(accessToken, this.getTokenOptions('access'));
    } catch {
      throw new UnauthorizedException('Falsified token');
    }

    return this.getWsToken(decoded.sub);
  }

  public getTokenOptions(type: 'access' | 'refresh' | 'ws'): JwtSignOptions {
    const options: JwtSignOptions = {
      secret: config.get(`tokens.${type}TokenSecret`),
    };

    const expiration = config.get(`tokens.${type}TokenExpirationSeconds`);
    if (expiration)
      options.expiresIn = `${expiration}s`;

    return options;
  }

  public async createOrUpdate(userInfo: MyEfreiDto): Promise<User> {
    const user = await this.userRepository.findOne({ id: userInfo.id });
    if (!user)
      return await this.usersService.create(userInfo);

    if (!user.hasChanged(userInfo))
      return user;

    wrap(user).assign(userInfo);
    await this.userRepository.flush();
    return user;
  }
}
