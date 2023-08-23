import { MeiliSearchService } from '../search/meilisearch.service';
import { RequestContext } from '../../shards/abstract/request-context';
import { addCookiesToResponse } from '../../shards/utils/add-cookies-to-response';
import { loadConfig } from '../../shards/utils/load-config';

import { requestContext } from '@fastify/request-context';
import { EntityManager } from '@mikro-orm/core';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { hash, verify } from 'argon2';
import DeviceDetector from 'device-detector-js';
import jsonwebtoken from 'jsonwebtoken';

import {
  User,
  Session,
  TeamMember,
  TeamMemberRole,
  TenantMember,
  TenantMemberRole,
  SessionRepository,
  UserRepository,
  TenantRepository,
  TeamRepository,
  TenantRoleRepository,
} from '@okampus/api/dal';
import { COOKIE_NAMES } from '@okampus/shared/consts';
import { RequestType, SessionClientType, TeamRoleType, TokenExpiration, TokenType } from '@okampus/shared/enums';
import { objectContains, randomId } from '@okampus/shared/utils';

import type { LoginDto } from './auth.types';
import type { UserOptions, SessionProps, Tenant, Team } from '@okampus/api/dal';
import type { Cookie, AuthClaims, ApiConfig } from '@okampus/shared/types';

import type { JwtSignOptions } from '@nestjs/jwt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Algorithm } from 'jsonwebtoken';

const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = jsonwebtoken;
const deviceDetector = new DeviceDetector();

type HttpOnlyTokens = TokenType.Access | TokenType.Refresh;
type AuthTokens = HttpOnlyTokens | TokenType.WebSocket;

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
    private readonly sessionRepository: SessionRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly tenantRoleRepository: TenantRoleRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
  ) {
    super();

    this.cookies = loadConfig(this.configService, 'cookies');
    this.tokens = loadConfig(this.configService, 'tokens');
    this.pepper = Buffer.from(loadConfig(this.configService, 'pepperSecret'));

    const algorithm = loadConfig(this.configService, 'jwt.algorithm') as Algorithm;
    const issuer = this.tokens.issuer;
    this.accessSignOptions = { issuer, secret: this.tokens.secrets[TokenType.Access], algorithm };
    this.botSignOptions = { issuer, secret: this.tokens.secrets[TokenType.Bot], algorithm };
    this.refreshSignOptions = { issuer, secret: this.tokens.secrets[TokenType.Refresh], algorithm };
  }

  public async findTenantByDomain(domain: string) {
    return await this.tenantRepository.findByDomain(domain);
  }

  public async findTenantByOidcName(oidcName: string) {
    return await this.tenantRepository.findByOidcName(oidcName);
  }

  public async findUser(slug: string) {
    return await this.userRepository.findOneOrFail({ slug }, { populate: ['adminRoles', 'actor'] });
  }

  public async findUserBySlug(slug: string) {
    return await this.userRepository.findOneOrFail({ slug }, { populate: ['adminRoles', 'actor'] });
  }

  public async createUser(createUser: UserOptions) {
    const user = new User(createUser);
    const tenantMember = new TenantMember({ user, tenantScope: createUser.tenantScope });

    user.tenantMemberships.add(new TenantMember({ user, tenantScope: createUser.tenantScope }));

    if (createUser.role) {
      const tenantRole = await this.tenantRoleRepository.findOneOrFail({ type: createUser.role });
      tenantMember.tenantMemberRoles.add(
        new TenantMemberRole({ tenantMember, tenantRole, tenantScope: createUser.tenantScope }),
      );
    }

    await this.em.persistAndFlush(user);
    return user;
  }

  public async processToken(token: string, expected: Partial<AuthClaims>, opts: JwtSignOptions): Promise<AuthClaims> {
    if (!token) throw new UnauthorizedException('Token not provided');

    try {
      await this.jwtService.verifyAsync<AuthClaims>(token, opts);
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new UnauthorizedException('Token expired');
      if (error instanceof JsonWebTokenError) throw new UnauthorizedException('Invalid token');
      if (error instanceof NotBeforeError) throw new UnauthorizedException('Token not active yet');
      throw new InternalServerErrorException('Token could not be verified');
    }

    const decoded = this.jwtService.decode(token);
    if (!decoded) throw new BadRequestException('Failed to decode JWT');

    const claims = { ...expected, iss: this.tokens.issuer };

    if (objectContains(decoded, claims)) {
      const sub = decoded.sub;
      if (sub !== undefined) return { ...decoded, sub };
    }
    throw new UnauthorizedException('Invalid token claims');
  }

  public async validateBotToken(token: string): Promise<User> {
    const decoded = await this.processToken(token, { req: RequestType.Http }, this.botSignOptions);

    const bot = await this.userRepository.findOneOrFail({ id: decoded.sub }, { populate: ['actor', 'adminRoles'] });
    if (!bot.isBot || !bot.passwordHash) throw new UnauthorizedException('Token not set'); // TODO: signalize odd state

    const isTokenValid = await verify(bot.passwordHash, token, { secret: this.pepper });
    if (!isTokenValid) throw new UnauthorizedException('Invalid credentials');

    return bot;
  }

  public async createBotToken(sub: string): Promise<string> {
    const bot = await this.userRepository.findOneOrFail(
      { id: sub, isBot: true },
      { populate: ['actor', 'adminRoles'] },
    );
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
    const session = await this.sessionRepository.findOne(findSession);
    let token, expirationToken, tokenFamily;

    /* If the session is still active, generate new refresh token or expire session */
    if (session) {
      if (session.lastIssuedAt.getTime() + this.tokens.expirations[TokenType.Refresh] * 1000 < Date.now()) {
        [token, expirationToken] = await this.createHttpOnlyJwt({ sub, fam: session.tokenFamily }, TokenType.Refresh);
        session.refreshTokenHash = await hash(token.value, { secret: this.pepper });
        session.lastIssuedAt = new Date();
        await this.em.flush();

        return [token, expirationToken];
      }

      session.expiredAt = new Date();
      tokenFamily = session.tokenFamily;
    }

    /* If there is no active session, create a new one */
    if (!tokenFamily) tokenFamily = randomId();
    [token, expirationToken] = await this.createHttpOnlyJwt({ sub, fam: tokenFamily }, TokenType.Refresh);

    const user = await this.userRepository.findOneOrFail({ id: sub }, { populate: ['actor', 'adminRoles'] });
    await this.createSession(userSession, token.value, tokenFamily, user);

    return [token, expirationToken];
  }

  public async refreshSession(req: FastifyRequest, res: FastifyReply, sub?: string): Promise<void> {
    if (!sub) throw new UnauthorizedException('User not found, cannot create tokens');

    const accessClaims = {
      sub,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': sub,
      },
    };

    addCookiesToResponse(
      await Promise.all([
        this.createHttpOnlyJwt(accessClaims, TokenType.Access),
        this.createRefreshToken(sub, req),
        this.createMeilisearchToken(),
      ]).then((arr) => arr.flat()),
      res,
    );
  }

  public async addWebSocketTokenIfAuthenticated(res: FastifyReply, sub?: string): Promise<void> {
    if (!sub) throw new UnauthorizedException('User not found, cannot create tokens');

    const claims = { sub, req: RequestType.WebSocket, tok: TokenType.WebSocket };
    const token = await this.createJwt(claims, TokenType.WebSocket);
    addCookiesToResponse([token], res);
  }

  public async createSession(
    sessionProps: SessionProps,
    token: string,
    tokenFamily: string,
    user: User,
  ): Promise<Session> {
    const refreshTokenHash = await hash(token, { secret: this.pepper });

    const session = new Session({
      ...sessionProps,
      user,
      refreshTokenHash,
      tokenFamily,
      createdBy: user,
      tenantScope: user.tenantScope,
    });

    await this.em.persistAndFlush(session);
    return session;
  }

  public async createTeamMember(
    user: User,
    team: Team,
    tenant: Tenant,
    type?: TeamRoleType.President | TeamRoleType.Secretary | TeamRoleType.Treasurer,
  ) {
    const teamMember = new TeamMember({ user, team, tenantScope: tenant });
    const role = team.teamRoles.getItems().find((role) => role.type === type);

    if (role) teamMember.teamMemberRoles.add(new TeamMemberRole({ teamMember, teamRole: role, tenantScope: tenant }));
    await this.em.flush();
  }

  public async validateUserToken(
    token: string,
    type: TokenType,
    req: FastifyRequest,
    res: FastifyReply,
  ): Promise<User> {
    const claims = { req: type === TokenType.WebSocket ? RequestType.WebSocket : RequestType.Http, tok: type };
    const options = type === TokenType.Refresh ? this.refreshSignOptions : this.accessSignOptions;

    const decoded = await this.processToken(token, claims, options);
    const { fam, sub } = decoded;

    const session = await this.sessionRepository.findOne(
      { ...this.getUserSession(req), user: { id: sub }, expiredAt: null, revokedAt: null },
      { populate: ['user', 'user.adminRoles', 'user.actor'] },
    );
    if (!session) throw new UnauthorizedException('No active session found');

    // Refresh token case (access token is absent) - validate refresh token and auto-refresh tokens
    if (type === TokenType.Refresh) {
      if (session.tokenFamily !== fam) throw new UnauthorizedException('Invalid token family'); // TODO: signal compromised & auto-revoke(?)
      if (!(await verify(session.refreshTokenHash, token, { secret: this.pepper }))) {
        session.revokedAt = new Date(); // Auto-revoke same family tokens
        throw new UnauthorizedException('Session has been compromised');
      }

      await this.refreshSession(req, res, sub);
    }

    return session.user;
  }

  public async login(body: LoginDto, req: FastifyRequest, res: FastifyReply): Promise<string> {
    const user = await this.userRepository.findOne(
      { $or: [{ slug: body.username }, { actor: { email: body.username } }] },
      { populate: ['actor', 'adminRoles'] },
    );

    if (!user) throw new UnauthorizedException('This user does not yet exist.');
    if (!user.passwordHash) throw new UnauthorizedException('This user does not yet have a password set.');

    const isPasswordValid = await verify(user.passwordHash, body.password, { secret: this.pepper });
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials.');

    await this.refreshSession(req, res, user.id);
    requestContext.set('requester', user);

    const isEmail = { $eq: user.actor.email };
    const teams = await this.teamRepository.find({
      $or: [
        { expectingPresidentEmail: isEmail },
        { expectingTreasurerEmail: isEmail },
        { expectingSecretaryEmail: isEmail },
      ],
    });

    await Promise.all(
      teams.map(async (team) => {
        if (team.expectingPresidentEmail === user.actor.email) {
          team.expectingPresidentEmail = '';
          await this.createTeamMember(user, team, this.tenant(), TeamRoleType.President);
        }
        if (team.expectingSecretaryEmail === user.actor.email) {
          team.expectingSecretaryEmail = '';
          await this.createTeamMember(user, team, this.tenant(), TeamRoleType.Secretary);
        }
        if (team.expectingTreasurerEmail === user.actor.email) {
          team.expectingTreasurerEmail = '';
          await this.createTeamMember(user, team, this.tenant(), TeamRoleType.Treasurer);
        }
      }),
    );

    return user.slug;
  }
}
