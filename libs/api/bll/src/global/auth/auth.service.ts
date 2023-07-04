// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MeiliSearchService } from '../search/meilisearch.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../graphql/hasura.service';

import { RequestContext } from '../../shards/abstract/request-context';
import { addCookiesToResponse } from '../../shards/utils/add-cookies-to-response';
import { loadConfig } from '../../shards/utils/load-config';

import { hash, verify } from 'argon2';
import DeviceDetector from 'device-detector-js';
import jsonwebtoken from 'jsonwebtoken';
import fastifyCookie from '@fastify/cookie';
import { requestContext } from '@fastify/request-context';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { JwtService } from '@nestjs/jwt';

import { Individual, Session, Tenant, User } from '@okampus/api/dal';
import { COOKIE_NAMES } from '@okampus/shared/consts';
import { RequestType, SessionClientType, TokenExpiration, TokenType } from '@okampus/shared/enums';
import { objectContains, randomId } from '@okampus/shared/utils';

import type { LoginDto } from './auth.types';

import type { JwtSignOptions } from '@nestjs/jwt';
import type { IndividualOptions } from '@okampus/api/dal';
import type { SessionProps } from '@okampus/shared/dtos';
import type { Cookie, AuthClaims, ApiConfig } from '@okampus/shared/types';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Algorithm } from 'jsonwebtoken';

const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = jsonwebtoken;
const deviceDetector = new DeviceDetector();

type HttpOnlyTokens = TokenType.Access | TokenType.Refresh;
type AuthTokens = HttpOnlyTokens | TokenType.WebSocket;

const individualPopulate = ['actor', 'adminRoles'];
const loginUserPopulate = [...individualPopulate, 'user'];
// const loginBotPopulate = [...individualPopulate, 'bot'];

const userPopulate = ['individual', ...individualPopulate.map((path) => `individual.${path}`)];
const sessionPopulate = ['user', ...userPopulate.map((path) => `user.${path}`)];

@Injectable()
export class AuthService extends RequestContext {
  cookies: ApiConfig['cookies'];
  tokens: ApiConfig['tokens'];
  pepper: Buffer;

  accessSignOptions: JwtSignOptions;
  botSignOptions: JwtSignOptions;
  refreshSignOptions: JwtSignOptions;

  logger = new Logger(AuthService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly meiliSearchService: MeiliSearchService,
    private readonly hasuraService: HasuraService
  ) {
    super();

    this.cookies = loadConfig<ApiConfig['cookies']>(this.configService, 'cookies');
    this.tokens = loadConfig<ApiConfig['tokens']>(this.configService, 'tokens');
    this.pepper = Buffer.from(loadConfig<string>(this.configService, 'pepperSecret'));

    const algorithm = loadConfig<string>(this.configService, 'jwt.algorithm') as Algorithm;
    const issuer = this.tokens.issuer;
    this.accessSignOptions = { issuer, secret: this.tokens.secrets[TokenType.Access], algorithm };
    this.botSignOptions = { issuer, secret: this.tokens.secrets[TokenType.Bot], algorithm };
    this.refreshSignOptions = { issuer, secret: this.tokens.secrets[TokenType.Refresh], algorithm };
  }

  public async findTenant(domain: string) {
    return await this.em.findOneOrFail(Tenant, { domain });
  }

  public async findUser(id: string) {
    return await this.em.findOneOrFail(Individual, { id });
  }

  public async findUserBySlug(slug: string) {
    return await this.em.findOneOrFail(Individual, { actor: { slug } });
  }

  public async createUser(createUser: IndividualOptions) {
    const user = new Individual(createUser);
    await this.em.persistAndFlush(user);
    return user;
  }

  public async processToken(token: string, expected: Partial<AuthClaims>, opts: JwtSignOptions): Promise<AuthClaims> {
    if (!token) throw new UnauthorizedException('Token not provided');

    const unsignedToken = fastifyCookie.unsign(token, this.cookies.signature);
    if (!unsignedToken.valid || !unsignedToken.value) throw new BadRequestException('Invalid cookie signature');

    try {
      await this.jwtService.verifyAsync<AuthClaims>(unsignedToken.value, opts);
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new UnauthorizedException('Token expired');
      if (error instanceof JsonWebTokenError) throw new UnauthorizedException('Invalid token');
      if (error instanceof NotBeforeError) throw new UnauthorizedException('Token not active yet');
      throw new InternalServerErrorException('Token could not be verified');
    }

    const decoded = this.jwtService.decode(unsignedToken.value);
    if (!decoded) throw new BadRequestException('Failed to decode JWT');

    const claims = { ...expected, iss: this.tokens.issuer };

    if (objectContains(decoded, claims)) {
      const sub = decoded.sub;
      if (sub !== undefined) return { ...decoded, sub };
    }
    throw new UnauthorizedException('Invalid token claims');
  }

  public async validateBotToken(token: string): Promise<Individual> {
    const decoded = await this.processToken(token, { req: RequestType.Http }, this.botSignOptions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bot = await this.em.findOneOrFail<Individual, any>(
      Individual,
      { id: decoded.sub },
      { populate: individualPopulate }
    );
    if (bot.bot || !bot.passwordHash) throw new UnauthorizedException('Token not set'); // TODO: signalize odd state

    const isTokenValid = await verify(bot.passwordHash, token, { secret: this.pepper });
    if (!isTokenValid) throw new UnauthorizedException('Invalid credentials');

    return bot;
  }

  public async createBotToken(sub: string): Promise<string> {
    const bot = await this.em.findOneOrFail(Individual, { id: sub, bot: { $ne: null } });
    const token = await this.jwtService.signAsync({ sub: bot.id, req: RequestType.Http }, this.botSignOptions);

    bot.passwordHash = await hash(token, { secret: this.pepper });
    await this.em.flush();

    return token;
  }

  /* Creates an Meilisearch API key that must be accessed by the frontend and passed as Authorization header later */
  public async createMeilisearchToken(): Promise<Cookie> {
    // The API key is valid for the same time as the access token
    const maxAge = this.tokens.expirations[TokenType.Access];
    const expiresAt = new Date(Date.now() + maxAge);

    const keyOptions = { indexes: [this.tenant().domain], actions: ['search'], expiresAt };
    const meiliSearchKey = await this.meiliSearchService.client.createKey(keyOptions);

    const options = { ...this.cookies.options, httpOnly: false, maxAge };
    return { name: COOKIE_NAMES[TokenType.MeiliSearch], value: meiliSearchKey.key, options };
  }

  public async createJwt(claims: Partial<AuthClaims>, tokenType: AuthTokens): Promise<Cookie> {
    const issuer = this.tokens.issuer;
    const secret = this.tokens.secrets[tokenType];
    const expiresIn = +this.tokens.expirations[tokenType];

    const token = await this.jwtService.signAsync(claims, { secret, issuer, expiresIn });
    const options = { ...this.cookies.options, maxAge: expiresIn };

    if (tokenType === TokenType.WebSocket) options.httpOnly = false; // NOTE: WS token is public, must be passed as Authorization header later
    return { value: token, name: COOKIE_NAMES[tokenType], options };
  }

  /* Creates an HttpOnly token with an "expiration" token making the token expiration accessible to JS */
  public async createHttpOnlyJwt(claims: AuthClaims, type: HttpOnlyTokens): Promise<Cookie[]> {
    const token = await this.createJwt({ ...claims, req: RequestType.Http, tok: type }, type);

    const maxAge = this.tokens.expirations[type];
    const value = (Date.now() + maxAge).toString();
    const name =
      type === TokenType.Access
        ? COOKIE_NAMES[TokenExpiration.AccessExpiration]
        : COOKIE_NAMES[TokenExpiration.RefreshExpiration];
    const expirationToken = { value, name, options: { ...this.cookies.options, httpOnly: false, maxAge } };

    return [token, expirationToken];
  }

  public getUserSession(req: FastifyRequest): SessionProps {
    const userAgent = deviceDetector.parse(req.headers['user-agent'] ?? '');
    const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip;
    const country = (req.headers['cf-ipcountry'] || req.headers['x-country-code']) ?? 'ZZ';
    const clientType = SessionClientType.WebClient;

    return { userAgent, ip: ip as string, country: country as string, clientType };
  }

  public async createRefreshToken(sub: string, req: FastifyRequest): Promise<Cookie[]> {
    const userSession = this.getUserSession(req);
    const findSession = { ...userSession, user: { id: sub }, expiredAt: null, revokedAt: null };
    const session = await this.em.findOne(Session, findSession);
    let jwt, exp, fam;

    /* If the session is still active, generate new refresh token or expire session */
    if (session) {
      if (session.lastIssuedAt.getTime() + this.tokens.expirations[TokenType.Refresh] * 1000 < Date.now()) {
        [jwt, exp] = await this.createHttpOnlyJwt({ sub, fam: session.tokenFamily }, TokenType.Refresh);
        session.refreshTokenHash = await hash(jwt.value, { secret: this.pepper });
        session.lastIssuedAt = new Date();
        await this.em.flush();

        return [jwt, exp];
      }

      session.expiredAt = new Date();
      fam = session.tokenFamily;
    }

    /* If there is no active session, create a new one */
    if (!fam) fam = randomId();
    [jwt, exp] = await this.createHttpOnlyJwt({ sub, fam }, TokenType.Refresh);
    await this.createSession(userSession, this.tenant(), jwt.value, fam, sub);

    return [jwt, exp];
  }

  public async refreshSession(req: FastifyRequest, res: FastifyReply, sub?: string): Promise<void> {
    if (!sub) throw new UnauthorizedException('User not found, cannot create tokens');

    const tokenPromises = [this.createHttpOnlyJwt({ sub }, TokenType.Access), this.createRefreshToken(sub, req)];
    const searchKeyPromise = this.configService.get('meilisearch.isEnabled') ? [this.createMeilisearchToken()] : [];
    addCookiesToResponse(await Promise.all([...tokenPromises, ...searchKeyPromise]).then((arr) => arr.flat()), res);
  }

  public async addWebSocketTokenIfAuthenticated(res: FastifyReply, sub?: string): Promise<void> {
    if (!sub) throw new UnauthorizedException('User not found, cannot create tokens');

    const claims = { sub, req: RequestType.WebSocket, tok: TokenType.WebSocket };
    const token = await this.createJwt(claims, TokenType.WebSocket);
    addCookiesToResponse([token], res);
  }

  public async createSession(
    userSession: SessionProps,
    tenant: Tenant,
    token: string,
    tokenFamily: string,
    sub: string
  ): Promise<Session> {
    const user = this.em.getReference(User, sub);
    if (!user) throw new InternalServerErrorException('User info not found');

    const refreshTokenHash = await hash(token, { secret: this.pepper });
    const createdBy = user.individual;
    const session = new Session({ ...userSession, user, refreshTokenHash, tokenFamily, createdBy, tenant });

    await this.em.persistAndFlush(session);
    return session;
  }

  public async validateUserToken(
    token: string,
    type: TokenType,
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<Individual> {
    const claims = { req: type === TokenType.WebSocket ? RequestType.WebSocket : RequestType.Http, tok: type };
    const options = type === TokenType.Refresh ? this.refreshSignOptions : this.accessSignOptions;

    const decoded = await this.processToken(token, claims, options);
    const { fam, sub } = decoded;

    const where = { ...this.getUserSession(req), user: { id: sub }, expiredAt: null, revokedAt: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await this.em.findOneOrFail<Session, any>(Session, where, { populate: sessionPopulate });
    if (!session) throw new UnauthorizedException('No active session found');

    // Refresh token case (access token is absent) - validate refresh token and auto-refresh tokens
    if (type === TokenType.Refresh) {
      if (!(session.tokenFamily === fam)) throw new UnauthorizedException('Invalid token family'); // TODO: signalize compromised & auto-revoke(?)
      if (!verify(session.refreshTokenHash, token, { secret: this.pepper })) {
        session.revokedAt = new Date(); // Auto-revoke same family tokens
        throw new UnauthorizedException('Session has been compromised');
      }

      await this.refreshSession(req, res, sub);
    }

    return session.user.individual;
  }

  public async login(body: LoginDto, selectionSet: string[], req: FastifyRequest, res: FastifyReply): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const individual = await this.em.findOneOrFail<Individual, any>(
      Individual,
      { actor: { $or: [{ slug: body.username }, { email: body.username }] }, tenant: this.tenant() },
      { populate: loginUserPopulate }
    );

    if (!individual || !individual.user) throw new UnauthorizedException('Account not yet registered.');
    if (!individual.passwordHash) throw new UnauthorizedException('Account not yet registered with password.');

    const isPasswordValid = await verify(individual.passwordHash, body.password, { secret: this.pepper });
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    await this.refreshSession(req, res, individual.user.id);

    requestContext.set('requester', individual);
    const data = await this.hasuraService.findByPk('userByPk', selectionSet, { id: individual.user.id });
    return data.userByPk;
  }
}
