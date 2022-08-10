import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { config } from '../shared/configs/config';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { TenantsService } from '../tenants/tenants/tenants.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import type { Token } from './auth.guard';
import type { MyEfreiDto } from './dto/myefrei.dto';

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
    private readonly tenantsService: TenantsService,
    private readonly jwtService: JwtService,
  ) {}

  public async validatePassword(userQuery: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      $or: [
        { id: { $ilike: userQuery } },
        { email: userQuery.toLowerCase() },
      ],
    }, { populate: ['schoolGroupMemberships', 'schoolGroupMemberships.schoolYear', 'schoolGroupMemberships.schoolGroup'] });

    if (user) {
      const [userPassword] = await this.userRepository.createQueryBuilder()
        .select(['id', 'password'])
        .where({ id: user.id })
        .limit(1);
      if (!userPassword)
        throw new BadRequestException('Password is not set');
      if (!(await user.validatePassword(password)))
        throw new UnauthorizedException('Invalid credentials');

      return user;
    }
    throw new BadRequestException('Invalid credentials');
  }

  public async login(user: User): Promise<TokenResponse> {
    const payload: Token = { sub: user.id, typ: 'usr', aud: 'http' };

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

  public async loginWithRefreshToken(refreshToken: string): Promise<User> {
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

    return await this.userRepository.findOneOrFail({ id: decoded.sub });
  }

  public getTokenOptions(type: 'access' | 'bot' | 'refresh' | 'ws'): JwtSignOptions {
    const options: JwtSignOptions = {
      secret: config.get(`tokens.${type}TokenSecret`),
    };

    if (type !== 'bot') {
      const expiration = config.get(`tokens.${type}TokenExpirationSeconds`);
      if (expiration)
        options.expiresIn = `${expiration}s`;
    }

    return options;
  }

  public async createOrUpdate(tenantId: string, userInfo: MyEfreiDto): Promise<User> {
    const tenant = await this.tenantsService.findOne(tenantId);
    const user = await this.userRepository.findOne({ id: userInfo.id });
    if (!user) {
      const { user: newUser } = await this.usersService.create({ ...userInfo, tenantId: tenant.id });
      return newUser;
    }

    if (!user.hasChanged({ ...userInfo, tenantId: tenant.id }))
      return user;

    wrap(user).assign(userInfo);
    await this.userRepository.flush();
    return user;
  }
}
