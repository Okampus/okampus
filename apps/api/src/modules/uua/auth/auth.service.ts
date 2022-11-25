import fastifyCookie from '@fastify/cookie';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { config } from '@common/configs/config';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { RequestType } from '@common/lib/types/enums/request-type.enum';
import { TokenType } from '@common/lib/types/enums/token-type.enum';
import type { TokenClaims } from '@common/lib/types/interfaces/token-claims.interface';
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
    const payload: TokenClaims = { sub: user.id, requestType: RequestType.Http };

    return {
      accessToken: await this.jwtService.signAsync(payload, this.getTokenOptions(TokenType.Access)),
      refreshToken: await this.jwtService.signAsync(payload, this.getTokenOptions(TokenType.Refresh)),
      accessTokenExpiresAt: Date.now() + config.tokens.accessTokenExpirationSeconds * 1000,
      refreshTokenExpiresAt: Date.now() + config.tokens.refreshTokenExpirationSeconds * 1000,
    };
  }

  public async processToken(
    token: string,
    expectedClaims: Partial<TokenClaims>,
    expectedOptions: JwtSignOptions,
  ): Promise<string> {
    if (!token)
      throw new UnauthorizedException('Token not provided');

    const unsignedToken = fastifyCookie.unsign(token, config.cookies.signature);
    if (!unsignedToken.valid || !unsignedToken.value)
      throw new BadRequestException('Invalid cookie signature');

    const decoded = this.jwtService.decode(unsignedToken.value) as TokenClaims;
    if (!decoded)
      throw new BadRequestException('Failed to decode JWT');

    if (!Object.entries(expectedClaims).every(([claim, value]) => decoded[claim as keyof TokenClaims] === value))
      throw new UnauthorizedException('Invalid token claims');

    try {
      await this.jwtService.verifyAsync<TokenClaims>(unsignedToken.value, expectedOptions);
    } catch {
      throw new UnauthorizedException('Falsified token');
    }

    return decoded.sub;
  }


  public async getWsToken(id: string): Promise<string> {
    return await this.jwtService.signAsync({ sub: id }, this.getTokenOptions(TokenType.WebSocket));
  }

  public async loginWithRefreshToken(refreshToken: string): Promise<User> {
    const sub = await this.processToken(
      refreshToken,
      { requestType: RequestType.Http },
      this.getTokenOptions(TokenType.Refresh),
    );
    return await this.userRepository.findOneOrFail({ id: sub });
  }

  public getTokenOptions(type: TokenType): JwtSignOptions {
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
