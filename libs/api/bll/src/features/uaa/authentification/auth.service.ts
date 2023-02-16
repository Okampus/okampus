import { AuthContextModel, getAuthContextPopulate } from './auth-context.model';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../../global/config.module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MeiliSearchService } from '../../search/meilisearch.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserFactory } from '../../../domains/factories/domains/users/user.factory';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantFactory } from '../../../domains/factories/domains/tenants/tenant.factory';

import { RequestContext } from '../../../shards/abstract/request-context';
import { addCookiesToResponse } from '../../../shards/utils/add-cookies-to-response';

import fastifyCookie from '@fastify/cookie';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { JwtService } from '@nestjs/jwt';

import { Session } from '@okampus/api/dal';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  BotRepository,
  TenantRepository,
  TenantCoreRepository,
  UserRepository,
  SessionRepository,
} from '@okampus/api/dal';

import { RequestType, SessionClientType, TokenType } from '@okampus/shared/enums';
import { objectContains } from '@okampus/shared/utils';
import { hash, verify } from 'argon2';

import DeviceDetector from 'device-detector-js';
import { nanoid } from 'nanoid';

import jsonwebtoken from 'jsonwebtoken';
const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = jsonwebtoken;

import type { JwtSignOptions } from '@nestjs/jwt';
import type { Bot, TenantCore, User } from '@okampus/api/dal';
import type { Cookie, AuthTokenClaims, Snowflake } from '@okampus/shared/types';
import type { LoginDto } from './dto/login.dto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { SessionProps } from '@okampus/shared/dtos';

type HttpOnlyTokens = TokenType.Access | TokenType.Refresh;
type AuthTokens = HttpOnlyTokens | TokenType.WebSocket;

type CookieWithMaxAge = Cookie & { options: { maxAge: number } };

@Injectable()
export class AuthService extends RequestContext {
  pepper: Buffer;
  deviceDetector = new DeviceDetector();
  signOptions: {
    access: JwtSignOptions;
    refresh: JwtSignOptions;
    bot: JwtSignOptions;
    websocket: JwtSignOptions;
  };
  expirations: {
    access: number;
    refresh: number;
    websocket: number;
  };

  constructor(
    private readonly configService: ConfigService,

    private readonly tenantCoreRepository: TenantCoreRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly botRepository: BotRepository,

    private readonly userFactory: UserFactory,
    private readonly tenantFactory: TenantFactory,

    private readonly jwtService: JwtService,
    private readonly meiliSearchService: MeiliSearchService
  ) {
    super();

    this.pepper = Buffer.from(this.configService.config.cryptoSecret);
    const issuer = this.configService.config.tokens.issuer;
    this.signOptions = {
      access: { issuer, secret: this.configService.config.tokens.secrets[TokenType.Access] },
      refresh: { issuer, secret: this.configService.config.tokens.secrets[TokenType.Refresh] },
      bot: { issuer, secret: this.configService.config.tokens.secrets[TokenType.Bot] },
      websocket: { issuer, secret: this.configService.config.tokens.secrets[TokenType.WebSocket] },
    };
    this.expirations = {
      access: this.configService.config.tokens.expirations[TokenType.Access],
      refresh: this.configService.config.tokens.expirations[TokenType.Refresh],
      websocket: this.configService.config.tokens.expirations[TokenType.WebSocket],
    };
  }

  public async findCoreTenant(domain: string) {
    const tenant = await this.tenantCoreRepository.findTenantByDomain(domain);
    if (!tenant) throw new BadRequestException(`Tenant with domain ${domain} not found`);

    return tenant;
  }

  public async processToken(
    token: string,
    expectedClaims: Partial<AuthTokenClaims>,
    options: JwtSignOptions
  ): Promise<AuthTokenClaims> {
    if (!token) throw new UnauthorizedException('Token not provided');

    const unsignedToken = fastifyCookie.unsign(token, this.configService.config.cookies.signature);
    if (!unsignedToken.valid || !unsignedToken.value) throw new BadRequestException('Invalid cookie signature');

    try {
      await this.jwtService.verifyAsync<AuthTokenClaims>(unsignedToken.value, options);
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new UnauthorizedException('Token expired');
      if (error instanceof JsonWebTokenError) throw new UnauthorizedException('Invalid token');
      if (error instanceof NotBeforeError) throw new UnauthorizedException('Token not active yet');
      throw new InternalServerErrorException('Token could not be verified');
    }

    const decoded = this.jwtService.decode(unsignedToken.value) as AuthTokenClaims;
    if (!decoded) throw new BadRequestException('Failed to decode JWT');

    if (!objectContains(decoded, { ...expectedClaims, iss: this.configService.config.tokens.issuer }) || !decoded.sub)
      throw new UnauthorizedException('Invalid token claims');

    return decoded;
  }

  public async validateBotToken(token: string): Promise<Bot> {
    const decoded = await this.processToken(token, { req: RequestType.Http }, this.signOptions.bot);
    const bot = await this.botRepository.findByIdOrFail(decoded.sub);

    // TODO: suspicious queries, signal them
    if (!bot.tokenHash) throw new UnauthorizedException('Token not set');

    const isTokenValid = await verify(bot.tokenHash, token, { secret: this.pepper });
    if (!isTokenValid) throw new UnauthorizedException('Invalid credentials');

    return bot;
  }

  public async createBotToken(sub: Snowflake): Promise<string> {
    const bot = await this.botRepository.findByIdOrFail(sub);
    const token = await this.jwtService.signAsync({ sub: bot.id, req: RequestType.Http }, this.signOptions.bot);

    bot.tokenHash = await hash(token, { secret: this.pepper });
    return token;
  }

  /* Creates an Meilisearch API key that must be accessed by the frontend and passed as Authorization header later */
  public async createMeilisearchToken(): Promise<Cookie> {
    // The API key is valid for the same time as the access token
    const maxAge = this.expirations.access * 1000;
    const meiliSearchKey = await this.meiliSearchService.client.createKey({
      indexes: [this.tenant().domain],
      actions: ['search'],
      expiresAt: new Date(Date.now() + maxAge),
    });

    const { names, options } = this.configService.config.cookies;
    return {
      name: names[TokenType.MeiliSearch],
      value: meiliSearchKey.key,
      options: { ...options, httpOnly: false, maxAge },
    };
  }

  public async createJwt(claims: Partial<AuthTokenClaims>, tokenType: AuthTokens): Promise<CookieWithMaxAge> {
    const { secrets, issuer, expirations } = this.configService.config.tokens;
    const { names, options: cookieOptions } = this.configService.config.cookies;

    const secret = secrets[tokenType];
    const expiresIn = +expirations[tokenType];

    const token = await this.jwtService.signAsync(claims, { secret, issuer, expiresIn });
    const options = { ...cookieOptions, maxAge: expiresIn * 1000 };

    // WebSocket token is public, must be accessed by the frontend and passed as Authorization header later
    if (tokenType === TokenType.WebSocket) options.httpOnly = false;

    return { value: token, name: names[tokenType], options };
  }

  /* Creates an HttpOnly token with an "expiration" token making the token expiration accessible to JS */
  public async createHttpOnlyJwt(claims: AuthTokenClaims, tokenType: HttpOnlyTokens): Promise<Cookie[]> {
    const { names, options } = this.configService.config.cookies;
    const token = await this.createJwt({ ...claims, req: RequestType.Http, tok: tokenType }, tokenType);

    const expirationToken = {
      value: (Date.now() + token.options.maxAge).toString(),
      name: names[`${tokenType}Expiration`],
      options: { ...options, httpOnly: false, maxAge: token.options.maxAge },
    };

    return [token, expirationToken];
  }

  public getUserSession(req: FastifyRequest): SessionProps {
    const userAgent = this.deviceDetector.parse(req.headers['user-agent'] ?? '');
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip;
    const country = (req.headers['cf-ipcountry'] || req.headers['x-country-code']) ?? 'ZZ';
    const clientType = SessionClientType.WebClient;

    return { userAgent, ip: ip as string, country: country as string, clientType };
  }

  public async createRefreshToken(sub: Snowflake, req: FastifyRequest): Promise<Cookie[]> {
    const userSession = this.getUserSession(req);
    const session = await this.sessionRepository.findActiveSession(sub, userSession);
    let jwt, exp, fam;

    /* If the session is still active, generate new refresh token or expire session */
    if (session) {
      if (session.lastIssuedAt.getTime() + this.expirations.refresh * 1000 < Date.now()) {
        [jwt, exp] = await this.createHttpOnlyJwt({ sub, fam: session.tokenFamily }, TokenType.Refresh);
        session.refreshTokenHash = await hash(jwt.value, { secret: this.pepper });
        session.lastIssuedAt = new Date();
        await this.sessionRepository.flush();

        return [jwt, exp];
      }

      session.expiredAt = new Date();
      fam = session.tokenFamily;
    }

    /* If there is no active session, create a new one */
    if (!fam) fam = nanoid(16);
    [jwt, exp] = await this.createHttpOnlyJwt({ sub, fam }, TokenType.Refresh);
    await this.createSession(userSession, this.tenant(), jwt.value, fam, sub);

    return [jwt, exp];
  }

  public async addTokensOnAuth(req: FastifyRequest, res: FastifyReply, sub?: Snowflake): Promise<void> {
    if (!sub) throw new UnauthorizedException('User not found, cannot create tokens');

    const tokens = await Promise.all([
      this.createHttpOnlyJwt({ sub }, TokenType.Access),
      this.createRefreshToken(sub, req),
      ...(this.configService.config.meilisearch.enabled ? [this.createMeilisearchToken()] : []),
    ]);

    addCookiesToResponse(tokens.flat(), res);
  }

  public async addWebSocketTokenIfAuthenticated(res: FastifyReply, sub?: Snowflake): Promise<void> {
    if (!sub) throw new UnauthorizedException('User not found, cannot create tokens');

    const claims = { sub, req: RequestType.WebSocket, tok: TokenType.WebSocket };
    const token = await this.createJwt(claims, TokenType.WebSocket);
    addCookiesToResponse([token], res);
  }

  public async createSession(
    userSession: SessionProps,
    tenant: TenantCore,
    token: string,
    tokenFamily: string,
    sub: Snowflake
  ): Promise<Session> {
    const user = { id: sub } as User;
    const refreshTokenHash = await hash(token, { secret: this.pepper });
    const session = new Session({ ...userSession, user, tenant, refreshTokenHash, tokenFamily });

    await this.sessionRepository.persistAndFlush(session);
    return session;
  }

  public async validateRefreshToken(token: string, req: FastifyRequest, res: FastifyReply): Promise<void> {
    const expectedClaims = { req: RequestType.Http, tok: TokenType.Refresh };
    const decoded = await this.processToken(token, expectedClaims, this.signOptions.refresh);

    const { fam, sub } = decoded;

    const userSession = this.getUserSession(req);
    const session = await this.sessionRepository.findActiveSession(sub, userSession);

    // TODO: trigger compromised account alert event
    if (!session) throw new UnauthorizedException('Session not found');
    if (!(session.tokenFamily === fam)) throw new UnauthorizedException('Invalid token family');
    if (!verify(session.refreshTokenHash, token, { secret: this.pepper })) {
      session.revokedAt = new Date(); // Auto-revoke same family tokens
      throw new UnauthorizedException('Session has been compromised');
    }

    await this.addTokensOnAuth(req, res, sub);
  }

  public async validateUserToken(token: string, tok: TokenType, req: FastifyRequest, res: FastifyReply): Promise<User> {
    const reqType = tok === TokenType.WebSocket ? RequestType.WebSocket : RequestType.Http;
    const options = tok === TokenType.Refresh ? this.signOptions.refresh : this.signOptions.access;
    const decoded = await this.processToken(token, { req: reqType, tok }, options);

    const session = await this.sessionRepository.findActiveSession(decoded.sub, this.getUserSession(req));
    if (!session) throw new UnauthorizedException('No active session found');

    // Refresh token case (access token is absent) - validate refresh token and auto-refresh tokens
    if (tok === TokenType.Refresh) await this.addTokensOnAuth(req as FastifyRequest, res as FastifyReply, decoded.sub);

    return session.user;
  }

  public async getAuthContext(user: User, req: FastifyRequest, res: FastifyReply) {
    const populate = getAuthContextPopulate(this.autoGqlPopulate());
    const getUser = async () => {
      await this.userRepository.populate(user, populate.user);
      return this.userFactory.entityToModelOrFail(user);
    };

    const getTenant = async () => {
      const where = { tenant: { id: user.tenant.id } };
      const tenant = await this.tenantRepository.findOneOrFail(where, { populate: populate.tenant });
      return this.tenantFactory.entityToModelOrFail(tenant);
    };

    const [userModel, tenantModel] = await Promise.all([getUser(), getTenant()]);

    await this.addTokensOnAuth(req, res, user.id);
    return new AuthContextModel(userModel, tenantModel);
  }

  public async login(body: LoginDto, req: FastifyRequest, res: FastifyReply): Promise<AuthContextModel> {
    const user = await this.userRepository.findOneByQuery(body.username);
    if (!user || !user.passwordHash) throw new UnauthorizedException('Account not yet registered with password');

    const isPasswordValid = await verify(user.passwordHash, body.password, { secret: this.pepper });
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return this.getAuthContext(user, req, res);
  }
}
