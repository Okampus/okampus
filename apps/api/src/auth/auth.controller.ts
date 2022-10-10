/* eslint-disable @typescript-eslint/member-ordering */
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  // UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import MeiliSearch from 'meilisearch';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { config } from '../shared/configs/config';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Public } from '../shared/lib/decorators/public.decorator';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import type { Tenant } from '../tenants/tenants/tenant.entity';
import { TenantsService } from '../tenants/tenants/tenants.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import type { TokenResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PreRegisterSsoDto } from './dto/pre-register-sso.dto';
import { RegisterDto } from './dto/register.dto';

const cookieOptions = config.cookies.options;
const cookiePublicOptions = { ...config.cookies.options, httpOnly: false };

@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
    @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch,
  ) {}

  @Public()
  @Post('login')
  public async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<User> {
    const user = await this.authService.validatePassword(body.username, body.password);
    const login = await this.authService.login(user);

    this.addAuthCookies(res, login);
    if (config.meilisearch.enabled)
      await this.addMeiliSearchCookie(res, user.tenant);

    return user;
  }

  // This endpoint is not public because the only way to connect to our website is through the SSO. There are only a
  // very few rare cases where we want to manually create an account, and it has to be done by an admin.
  @CheckPolicies(ability => ability.can(Action.Create, User))
  @Post('register')
  public async register(@Body() dto: RegisterDto): Promise<{ user: User; token: string | null }> {
    const tenant = await this.tenantsService.findOne(dto.tenantId);
    try {
      return await this.usersService.create({ ...dto, tenantId: tenant.id });
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('User id already taken');

      throw error;
    }
  }

  @CheckPolicies(ability => ability.can(Action.Create, User))
  @Post('pre-register-sso')
  public async preRegisterSso(@Body() dto: PreRegisterSsoDto): Promise<{ user: User; token: string | null }> {
    const tenant = await this.tenantsService.findOne(dto.tenantId);
    try {
      return await this.usersService.create({ ...dto, tenantId: tenant.id });
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('User id already taken');

      throw error;
    }
  }

  @Public()
  @Get('logout')
  public logout(@Res({ passthrough: true }) res: FastifyReply): void {
    void res.setCookie('accessToken', '', { ...cookiePublicOptions, maxAge: 0 })
      .setCookie('refreshToken', '', { ...cookiePublicOptions, maxAge: 0 })
      .setCookie('accessTokenExpiresAt', '', { ...cookiePublicOptions, maxAge: 0 })
      .setCookie('refreshTokenExpiresAt', '', { ...cookiePublicOptions, maxAge: 0 })
      .setCookie('meiliSearchKey', '', { ...cookiePublicOptions, maxAge: 0 });
  }

  @Post('refresh-token')
  public async refreshToken(@Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<void> {
    let user: User | undefined;
    if (req.cookies.refreshToken)
      user = await this.authService.loginWithRefreshToken(req.cookies.refreshToken);

    if (!user)
      new BadRequestException('Missing refresh token');

    const login = await this.authService.login(user!);
    if (config.meilisearch.enabled)
      await this.addMeiliSearchCookie(res, user!.tenant);

    void res.setCookie('accessToken', login.accessToken, cookieOptions);
  }

  @Post('ws-token')
  public async wsToken(@CurrentUser() user: User, @Res() res: FastifyReply): Promise<void> {
    const wsToken = await this.authService.getWsToken(user.id);
    if (wsToken) {
      void res.setCookie('wsToken', wsToken, {
        ...cookiePublicOptions,
        maxAge: config.tokens.wsTokenExpirationSeconds * 1000,
      });
    } else {
      new BadRequestException('Missing access token');
    }
  }

  @Get('me')
  public me(@CurrentUser() user: User): User {
    return user;
  }

  private async addMeiliSearchCookie(res: FastifyReply, tenant: Tenant): Promise<void> {
    // MeiliSearch API Key expires with the accessToken
    // Must be passed as Authorization header in the frontend
    const meiliSearchKey = await this.meiliSearch.createKey({
      indexes: [tenant.id],
      actions: ['search'],
      expiresAt: new Date(Date.now() + config.tokens.accessTokenExpirationSeconds * 1000).toISOString(),
    });

    void res.setCookie(
      'meiliSearchKey',
      meiliSearchKey.key,
      {
        ...cookiePublicOptions,
        maxAge: config.tokens.accessTokenExpirationSeconds * 1000,
      },
    );
  }

  private addAuthCookies(res: FastifyReply, tokens: TokenResponse): void {
    const maxAgeAccess = config.tokens.accessTokenExpirationSeconds * 1000;
    const maxAgeRefresh = config.tokens.refreshTokenExpirationSeconds * 1000;

    void res.setCookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: maxAgeAccess })
      .setCookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: maxAgeRefresh })
      .setCookie('accessTokenExpiresAt', tokens.accessTokenExpiresAt.toString(), { ...cookiePublicOptions, maxAge: maxAgeAccess })
      .setCookie('refreshTokenExpiresAt', tokens.refreshTokenExpiresAt.toString(), { ...cookiePublicOptions, maxAge: maxAgeRefresh });
  }

  @Public()
  @Get(':id/callback')
  public async tenantLoginCallback(@CurrentUser() user: User, @Res() res: FastifyReply): Promise<void> {
    const login = await this.authService.login(user);

    if (config.meilisearch.enabled)
      await this.addMeiliSearchCookie(res, user.tenant);

    this.addAuthCookies(res, login);
    void res.redirect(`${config.network.frontendUrl + (config.env.isDev() ? '/#' : '')}/auth`);
  }
}
