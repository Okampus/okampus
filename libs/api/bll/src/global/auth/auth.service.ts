import { MeiliSearchService } from '../search/meilisearch.service';

import { HasuraService } from '../graphql/hasura.service';

import { RequestContext } from '../../shards/abstract/request-context';
import { addCookiesToResponse } from '../../shards/utils/add-cookies-to-response';
import { loadConfig } from '../../shards/utils/load-config';

import fastifyCookie from '@fastify/cookie';
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
  Tenant,
  Team,
  TenantMember,
  TenantRole,
  TenantMemberRole,
} from '@okampus/api/dal';
import { COOKIE_NAMES } from '@okampus/shared/consts';
import { RequestType, SessionClientType, TeamRoleType, TokenExpiration, TokenType } from '@okampus/shared/enums';
import { objectContains, randomId } from '@okampus/shared/utils';

import type { LoginDto } from './auth.types';
import type { UserOptions, SessionProps } from '@okampus/api/dal';
import type { Cookie, AuthClaims, ApiConfig } from '@okampus/shared/types';

import type { JwtSignOptions } from '@nestjs/jwt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Algorithm } from 'jsonwebtoken';

const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = jsonwebtoken;
const deviceDetector = new DeviceDetector();

type HttpOnlyTokens = TokenType.Access | TokenType.Refresh;
type AuthTokens = HttpOnlyTokens | TokenType.WebSocket;

const userPopulate = ['actor', 'adminRoles'];
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
    private readonly hasuraService: HasuraService,
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
    return await this.em.findOneOrFail(Tenant, { domain });
  }

  public async findTenantByOidcName(oidcName: string) {
    return await this.em.findOneOrFail(Tenant, { oidcName });
  }

  public async findUser(id: string) {
    return await this.em.findOneOrFail(User, { id });
  }

  public async findUserBySlug(slug: string) {
    return await this.em.findOneOrFail(User, { slug });
  }

  public async createUser(createUser: UserOptions) {
    const user = new User(createUser);
    const tenantMember = new TenantMember({ user, tenantScope: createUser.tenantScope });

    user.tenantMemberships.add(new TenantMember({ user, tenantScope: createUser.tenantScope }));

    if (createUser.role) {
      const tenantRole = await this.em.findOneOrFail(TenantRole, { type: createUser.role });
      tenantMember.tenantMemberRoles.add(
        new TenantMemberRole({ tenantMember, tenantRole, tenantScope: createUser.tenantScope }),
      );
    }

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

  public async validateBotToken(token: string): Promise<User> {
    const decoded = await this.processToken(token, { req: RequestType.Http }, this.botSignOptions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bot = await this.em.findOneOrFail<User, any>(User, { id: decoded.sub }, { populate: userPopulate });
    if (!bot.isBot || !bot.passwordHash) throw new UnauthorizedException('Token not set'); // TODO: signalize odd state

    const isTokenValid = await verify(bot.passwordHash, token, { secret: this.pepper });
    if (!isTokenValid) throw new UnauthorizedException('Invalid credentials');

    return bot;
  }

  public async createBotToken(sub: string): Promise<string> {
    const bot = await this.em.findOneOrFail(User, { id: sub, isBot: true });
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
    await this.createSession(userSession, this.tenant(), token.value, tokenFamily, sub);

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

    const tokenPromises = [this.createHttpOnlyJwt(accessClaims, TokenType.Access), this.createRefreshToken(sub, req)];
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
    sessionProps: SessionProps,
    tenant: Tenant,
    token: string,
    tokenFamily: string,
    sub: string,
  ): Promise<Session> {
    const user = this.em.getReference(User, sub);
    if (!user) throw new InternalServerErrorException('User info not found');

    const refreshTokenHash = await hash(token, { secret: this.pepper });
    const session = new Session({
      ...sessionProps,
      user,
      refreshTokenHash,
      tokenFamily,
      createdBy: user,
      tenantScope: tenant,
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
    const teamMember = new TeamMember({ user, team, tenantScope: tenant, start: new Date() });
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

    const where = { ...this.getUserSession(req), user: { id: sub }, expiredAt: null, revokedAt: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await this.em.findOneOrFail<Session, any>(Session, where, { populate: sessionPopulate });
    if (!session) throw new UnauthorizedException('No active session found');

    // Refresh token case (access token is absent) - validate refresh token and auto-refresh tokens
    if (type === TokenType.Refresh) {
      if (session.tokenFamily !== fam) throw new UnauthorizedException('Invalid token family'); // TODO: signalize compromised & auto-revoke(?)
      if (!(await verify(session.refreshTokenHash, token, { secret: this.pepper }))) {
        session.revokedAt = new Date(); // Auto-revoke same family tokens
        throw new UnauthorizedException('Session has been compromised');
      }

      await this.refreshSession(req, res, sub);
    }

    return session.user;
  }

  public async login(
    body: LoginDto,
    selectionSet: string[],
    req: FastifyRequest,
    res: FastifyReply,
  ): Promise<{
    user: User;
    canManageTenant: boolean;
    onboardingTeams: Team[];
  }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await this.em.findOne<User, any>(
      User,
      { $or: [{ slug: body.username }, { actor: { email: body.username } }], tenantScope: this.tenant() },
      { populate: userPopulate },
    );

    if (!user) throw new UnauthorizedException('This user does not yet exist.');
    if (!user.passwordHash) throw new UnauthorizedException('This user does not yet have a password set.');

    const isPasswordValid = await verify(user.passwordHash, body.password, { secret: this.pepper });
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials.');

    await this.refreshSession(req, res, user.id);

    requestContext.set('requester', user);

    const userData = selectionSet.some((field) => field.startsWith('user'))
      ? await this.hasuraService.findByPk(
          'userByPk',
          selectionSet.filter((field) => field.startsWith('user')).map((field) => field.replace('user.', '')),
          { id: user.id },
        )
      : undefined;

    const teams = await this.em.find(Team, {
      $or: [
        { expectingPresidentEmail: { $eq: user.actor.email } },
        { expectingTreasurerEmail: { $eq: user.actor.email } },
        { expectingSecretaryEmail: { $eq: user.actor.email } },
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

    const teamsData = selectionSet.some((field) => field.startsWith('onboardingTeams'))
      ? await this.hasuraService.find(
          'team',
          selectionSet
            .filter((field) => field.startsWith('onboardingTeams'))
            .map((field) => field.replace('onboardingTeams.', '')),
          { expectingPresidentEmail: { _eq: user.actor.email } },
        )
      : undefined;

    return {
      ...(userData && { user: userData.userByPk }),
      ...(teamsData && { onboardingTeams: teamsData.team }),
      canManageTenant: user.adminRoles
        .getItems()
        .some(({ canManageTenantEntities: canManage, tenant }) =>
          tenant === null ? canManage : tenant.id === this.tenant().id && canManage,
        ),
    };
  }
}
