import fastifyCookie from '@fastify/cookie';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import isMatch from 'lodash.ismatch';
import MeiliSearch from 'meilisearch';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { config } from '@common/configs/config';
import { GlobalRequestService } from '@common/lib/helpers/global-request-service';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { RequestType } from '@common/lib/types/enums/request-type.enum';
import { TokenType } from '@common/lib/types/enums/token-type.enum';
import type { Cookie } from '@common/lib/types/interfaces/cookie';
import type { TokenClaims } from '@common/lib/types/interfaces/token-claims.interface';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import type { LoginDto } from './dto/login.dto';
import type { PreRegisterSsoDto } from './dto/pre-register-sso.dto';

const cookiePublicOptions = { ...config.cookies.options, httpOnly: false };

@Injectable()
export class AuthService extends GlobalRequestService {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch,
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly jwtService: JwtService,
  ) { super(); }

  public async validatePassword(userQuery: string, password: string): Promise<User> {
    const user = await this.usersService.findBareUser(userQuery);
    if (!user)
      throw new BadRequestException('User does not exist');

    if (!user.password)
      throw new UnauthorizedException('User password not set');

    if (!await user.validatePassword(password))
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  public async generateMeilisearchKey(): Promise<Cookie> {
    // MeiliSearch API Key expires with the accessToken
    // Must be passed as Authorization header in the frontend
    const maxAge = config.tokens.expiration.access * 1000;
    const meiliSearchKey = await this.meiliSearch.createKey({
      indexes: [this.currentTenant().id],
      actions: ['search'],
      expiresAt: new Date(Date.now() + maxAge).toISOString(),
    });

    return {
      name: config.cookies.names.meilisearch,
      value: meiliSearchKey.key,
      options: { ...cookiePublicOptions, maxAge },
    };
  }

  public async generateToken(
    claims: Partial<TokenClaims>,
    tokenType: Exclude<TokenType, TokenType.Bot | TokenType.MeiliSearch>,
  ): Promise<Cookie> {
    const maxAge = config.tokens.expiration[tokenType] * 1000;
    const options = { ...(tokenType === TokenType.WebSocket ? cookiePublicOptions : config.cookies.options), maxAge };

    const token = await this.jwtService.signAsync(
      { ...claims, iss: config.tokens.issuerName, exp: Date.now() + maxAge },
      { secret: config.tokens.secrets[tokenType] },
    );

    return { value: token, name: config.cookies.names[tokenType], options };
  }

  public async generateBotToken(botId: string): Promise<string> {
    const bot = await this.usersService.findBareUser(botId);
    if (!bot.bot)
      throw new BadRequestException('Only bots can generate tokens');

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Update, bot);

    const token = await this.jwtService.signAsync(
      { sub: bot.id, requestType: RequestType.Http } as TokenClaims,
      { secret: config.tokens.secrets.bot },
    );

    await bot.setPassword(token);
    return token;
  }

  public async generateAccessTokens(user: User): Promise<Cookie[]> {
    const accessToken = await this.generateToken({ sub: user.id, requestType: RequestType.Http }, TokenType.Access);
    const exp = new Date(Date.now() + accessToken.options.maxAge!).toString();

    const accessTokenExp = { value: exp, name: config.cookies.names.accessExpiration, options: cookiePublicOptions };

    if (config.meilisearch.enabled)
      return [accessToken, accessTokenExp, await this.generateMeilisearchKey()];
    return [accessToken, accessTokenExp];
  }

  public async generateRefreshTokens(user: User): Promise<Cookie[]> {
    const refreshToken = await this.generateToken({ sub: user.id, requestType: RequestType.Http }, TokenType.Refresh);
    const exp = new Date(Date.now() + refreshToken.options.maxAge!).toString();

    const refreshTokenExp = { value: exp, name: config.cookies.names.accessExpiration, options: cookiePublicOptions };

    return [refreshToken, refreshTokenExp];
  }

  public async generateTokens(user: User): Promise<Cookie[]> {
    if (!user)
      throw new UnauthorizedException('User not found, cannot generate tokens');

    const tokens = await Promise.all([this.generateAccessTokens(user), this.generateRefreshTokens(user)]);
    return tokens.flat();
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

    try {
      await this.jwtService.verifyAsync<TokenClaims>(unsignedToken.value, expectedOptions);
    } catch {
      throw new UnauthorizedException('Falsified token');
    }

    const decoded = this.jwtService.decode(unsignedToken.value) as TokenClaims;
    if (!decoded)
      throw new BadRequestException('Failed to decode JWT');

    if (!isMatch(decoded, { ...expectedClaims, iss: config.tokens.issuerName }) || !decoded.sub)
      throw new UnauthorizedException('Invalid token claims');

    if (decoded.exp && decoded.exp < Date.now())
      throw new UnauthorizedException('Token expired');

    return decoded.sub;
  }

  public async login(body: LoginDto): Promise<{ user: User; tokens: Cookie[] }> {
    const user = await this.validatePassword(body.username, body.password);
    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  // Public async loginWithRefreshToken(refreshToken: string): Promise<User> {
  //   // const sub = await this.processToken(
  //   //   refreshToken,
  //   //   { requestType: RequestType.Http },
  //   //   this.getTokenSignOptions(TokenType.Refresh),
  //   // );
  //   // return await this.userRepository.findOneOrFail({ id: sub });
  // }

  // Public async register(body: RegisterDto): Promise<{ user: User; token: string | null }> {}

  // Public getTokenSignOptions(type: TokenType): JwtSignOptions {
  //   const options: JwtSignOptions = {
  //     secret: config.tokens.secrets[type],
  //   };

  //   return options;
  // }

  // public async generateWsToken(id: string): Promise<string> {
  //   return await this.jwtService.signAsync({ sub: id }, { secret: config.tokens.secrets });
  // }

  // public async loginWithRefreshToken(refreshToken: string): Promise<User> {
  //   const sub = await this.processToken(
  //     refreshToken,
  //     { requestType: RequestType.Http },
  //     this.getTokenSignOptions(TokenType.Refresh),
  //   );
  //   return await this.userRepository.findOneOrFail({ id: sub });
  // }

  public async createOrUpdate(userInfo: PreRegisterSsoDto, forTenant: string): Promise<User> {
    const user = await this.usersService.findBareUser(userInfo.id);
    if (!user)
      return await this.usersService.createBare(userInfo, forTenant);

    if (!user.hasChanged({ ...userInfo }))
      return user;

    wrap(user).assign(userInfo);
    await this.userRepository.flush();
    return user;
  }
}
