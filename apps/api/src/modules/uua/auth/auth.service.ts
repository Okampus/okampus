import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { config } from '@meta/shared/configs/config';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import type { TokenClaims } from '@meta/shared/lib/types/interfaces/token-claims.interface';
import { processToken } from '@meta/shared/lib/utils/process-token';
import { TenantsService } from '@modules/org/tenants/tenants.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import type { TenantUserDto } from './dto/tenant-user.dto';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
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
    }, { populate: ['classMemberships', 'classMemberships.schoolYear', 'classMemberships.schoolClass'] });

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
    const payload: TokenClaims = { sub: user.id, tokenType: 'http' };

    return {
      accessToken: await this.jwtService.signAsync(payload, this.getTokenOptions('access')),
      refreshToken: await this.jwtService.signAsync(payload, this.getTokenOptions('refresh')),
      accessTokenExpiresAt: Date.now() + config.tokens.accessTokenExpirationSeconds * 1000,
      refreshTokenExpiresAt: Date.now() + config.tokens.refreshTokenExpirationSeconds * 1000,
    };
  }

  public async getWsToken(id: string): Promise<string> {
    return await this.jwtService.signAsync({ sub: id, aud: 'ws' }, this.getTokenOptions('ws'));
  }

  public async loginWithRefreshToken(refreshToken: string): Promise<User> {
    const sub = await processToken(this.jwtService, refreshToken, { tokenType: 'http' }, this.getTokenOptions('refresh'));
    return await this.userRepository.findOneOrFail({ id: sub });
  }

  public getTokenOptions(type: 'access' | 'refresh' | 'ws'): JwtSignOptions {
    const options: JwtSignOptions = {
      secret: config.tokens[`${type}TokenSecret`],
    };

    return options;
  }

  public async createOrUpdate(tenantId: string, userInfo: TenantUserDto): Promise<User> {
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
