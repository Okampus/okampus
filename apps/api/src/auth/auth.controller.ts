import { UniqueConstraintViolationException } from '@mikro-orm/core';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { computedConfig, config } from '../shared/configs/config';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Public } from '../shared/lib/decorators/public.decorator';
import { MyEfreiOidcEnabledGuard } from '../shared/lib/guards/myefrei-oidc-enabled.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { MeiliSearchGlobal } from '../shared/modules/search/meilisearch.global';
import type { Tenant } from '../tenants/tenants/tenant.entity';
import { TenantsService } from '../tenants/tenants/tenants.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import type { TokenResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PreRegisterSsoDto } from './dto/pre-register-sso.dto';
import { RegisterDto } from './dto/register.dto';
import { MyEfreiAuthGuard } from './myefrei-auth.guard';

const cookieOptions = config.get('cookies.options');
const cookiePublicOptions = { ...config.get('cookies.options'), httpOnly: false };

@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly meiliSearchGlobal: MeiliSearchGlobal,
    private readonly tenantsService: TenantsService,
  ) {}

  @Public()
  @Post('login')
  public async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const user = await this.authService.validatePassword(body.username, body.password);
    const login = await this.authService.login(user);

    this.addAuthCookies(res, login);
    if (config.get('meilisearch.enabled'))
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
  @UseGuards(MyEfreiOidcEnabledGuard, MyEfreiAuthGuard)
  @Get('myefrei')
  public myefreiLogin(): void {
    // Logging in with MyEfrei! Everything is handled by the guard.
  }

  @Public()
  @UseGuards(MyEfreiOidcEnabledGuard, MyEfreiAuthGuard)
  @Get('myefrei/callback')
  public async myefreiCallback(@CurrentUser() user: User, @Res() res: Response): Promise<void> {
    const login = await this.authService.login(user);

    if (config.get('meilisearch.enabled'))
      await this.addMeiliSearchCookie(res, user.tenant);

    this.addAuthCookies(res, login)
      .redirect(`${computedConfig.frontendUrl + (config.get('nodeEnv') === 'development' ? '/#' : '')}/auth`);
  }

  @Public()
  @Get('logout')
  public logout(@Res({ passthrough: true }) res: Response): void {
    res.cookie('accessToken', '', { ...cookiePublicOptions, maxAge: 0 })
      .cookie('refreshToken', '', { ...cookiePublicOptions, maxAge: 0 })
      .cookie('accessTokenExpiresAt', '', { ...cookiePublicOptions, maxAge: 0 })
      .cookie('refreshTokenExpiresAt', '', { ...cookiePublicOptions, maxAge: 0 })
      .cookie('meiliSearchKey', '', { ...cookiePublicOptions, maxAge: 0 });
  }

  @Post('refresh-token')
  public async refreshToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = await this.authService.loginWithRefreshToken(req.signedCookies?.refreshToken as string);
    if (!user)
      new BadRequestException('Missing refresh token');

    const login = await this.authService.login(user);
    if (config.get('meilisearch.enabled'))
      await this.addMeiliSearchCookie(res, user.tenant);

    res.cookie('accessToken', login.accessToken, cookieOptions).send();
  }

  @Post('ws-token')
  public async wsToken(@CurrentUser() user: User, @Res() res: Response): Promise<void> {
    const wsToken = await this.authService.getWsToken(user.id);
    if (wsToken) {
      res.cookie('wsToken', wsToken, { ...cookiePublicOptions, maxAge: config.get('tokens.wsTokenExpirationSeconds') * 1000 });
      return;
    }
    new BadRequestException('Missing access token');
  }

  @Get('me')
  public me(@CurrentUser() user: User): User {
    return user;
  }

  private async addMeiliSearchCookie(res: Response, tenant: Tenant): Promise<Response> {
    // MeiliSearch API Key expires with the accessToken
    // Must be passed as Authorization header in the frontend
    const meiliSearchKey = await this.meiliSearchGlobal.client.createKey({
      indexes: [tenant.id],
      actions: ['search'],
      expiresAt: new Date(Date.now() + config.get('tokens.accessTokenExpirationSeconds') * 1000).toISOString(),
    });

    return res.cookie(
      'meiliSearchKey',
      meiliSearchKey.key,
      {
        ...cookiePublicOptions,
        maxAge: config.get('tokens.accessTokenExpirationSeconds') * 1000,
      },
    );
  }

  private addAuthCookies(res: Response, tokens: TokenResponse): Response {
    const maxAgeAccess = config.get('tokens.accessTokenExpirationSeconds') * 1000;
    const maxAgeRefresh = config.get('tokens.refreshTokenExpirationSeconds') * 1000;

    return res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: maxAgeAccess })
      .cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: maxAgeRefresh })
      .cookie('accessTokenExpiresAt', tokens.accessTokenExpiresAt, { ...cookiePublicOptions, maxAge: maxAgeAccess })
      .cookie('refreshTokenExpiresAt', tokens.refreshTokenExpiresAt, { ...cookiePublicOptions, maxAge: maxAgeRefresh });
  }
}
