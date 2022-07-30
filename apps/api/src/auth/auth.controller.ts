import { UniqueConstraintViolationException } from '@mikro-orm/core';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as Req, Response as Res } from 'express';
import { computedConfig, config } from '../shared/configs/config';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Public } from '../shared/lib/decorators/public.decorator';
import { MyEfreiOidcEnabledGuard } from '../shared/lib/guards/myefrei-oidc-enabled.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
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
  ) {}

  @Public()
  @Post('login')
  public async login(@Body() body: LoginDto, @Response({ passthrough: true }) res: Res): Promise<User> {
    const user = await this.authService.validatePassword(body.username, body.password);
    const login = await this.authService.login(user);

    this.addAuthCookies(res, login);

    return user;
  }

  // This endpoint is not public because the only way to connect to our website is through the SSO. There are only a
  // very few rare cases where we want to manually create an account, and it has to be done by an admin.
  @CheckPolicies(ability => ability.can(Action.Create, User))
  @Post('register')
  public async register(@Body() dto: RegisterDto): Promise<{ user: User; token: string | null }> {
    try {
      return await this.usersService.create(dto);
    } catch (error) {
      if (error.code instanceof UniqueConstraintViolationException)
        throw new BadRequestException('User id already taken');

      throw error;
    }
  }

  @CheckPolicies(ability => ability.can(Action.Create, User))
  @Post('pre-register-sso')
  public async preRegisterSso(@Body() dto: PreRegisterSsoDto): Promise<{ user: User; token: string | null }> {
    try {
      return await this.usersService.create(dto);
    } catch (error) {
      if (error.code instanceof UniqueConstraintViolationException)
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
  public async myefreiCallback(@CurrentUser() user: User, @Response() res: Res): Promise<void> {
    const login = await this.authService.login(user);

    this.addAuthCookies(res, login)
      .redirect(`${computedConfig.frontendUrl + (config.get('nodeEnv') === 'development' ? '/#' : '')}/auth`);
  }

  @Public()
  @Get('logout')
  public logout(@Response({ passthrough: true }) res: Res): void {
    res.cookie('accessToken', '', { ...cookiePublicOptions, maxAge: 0 })
      .cookie('refreshToken', '', { ...cookiePublicOptions, maxAge: 0 })
      .cookie('accessTokenExpiresAt', '', { ...cookiePublicOptions, maxAge: 0 })
      .cookie('refreshTokenExpiresAt', '', { ...cookiePublicOptions, maxAge: 0 });
  }

  @Post('refresh-token')
  public async refreshToken(@Request() req: Req, @Response() res: Res): Promise<void> {
    const login = await this.authService.loginWithRefreshToken(req.signedCookies?.refreshToken as string);
    if (login)
      res.cookie('accessToken', login.accessToken, cookieOptions).send();

    new BadRequestException('Missing refresh token');
  }

  @Post('ws-token')
  public async wsToken(@Request() req: Req, @Response() res: Res): Promise<void> {
    const wsToken = await this.authService.getWsTokenWithAccessToken(req.signedCookies?.accessToken as string);
    if (wsToken)
      res.cookie('wsToken', wsToken, { ...cookiePublicOptions, maxAge: config.get('tokens.wsTokenExpirationSeconds') * 1000 }).send();

    new BadRequestException('Missing access token');
  }

  @Get('me')
  public me(@CurrentUser() user: User): User {
    return user;
  }

  private addAuthCookies(res: Res, tokens: TokenResponse): Res {
    const maxAgeAccess = config.get('tokens.accessTokenExpirationSeconds') * 1000;
    const maxAgeRefresh = config.get('tokens.refreshTokenExpirationSeconds') * 1000;

    return res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: maxAgeAccess })
      .cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: maxAgeRefresh })
      .cookie('accessTokenExpiresAt', tokens.accessTokenExpiresAt, { ...cookiePublicOptions, maxAge: maxAgeAccess })
      .cookie('refreshTokenExpiresAt', tokens.refreshTokenExpiresAt, { ...cookiePublicOptions, maxAge: maxAgeRefresh });
  }
}
