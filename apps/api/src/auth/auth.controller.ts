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
import { RegisterDto } from './dto/register.dto';
import { MyEfreiAuthGuard } from './myefrei-auth.guard';

const cookieOptions = config.get('cookies.options');
const cookiePublicOptions = { ...config.get('cookies.options'), httpOnly: false };

interface TokenExpiringPayload {
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

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

    this.addTokens(user, {
      accessTokenExpiresAt: login.accessTokenExpiresAt.toString(),
      refreshTokenExpiresAt: login.refreshTokenExpiresAt.toString(),
    });
    this.addAuthCookies(res, login);

    return user;
  }

  // This endpoint is not public because the only way to connect to our website is through the SSO. There are only a
  // very few rare cases where we want to manually create an account, and it has to be done by an admin.
  @CheckPolicies(ability => ability.can(Action.Create, User))
  @Post('register')
  public async register(@Body() dto: RegisterDto): Promise<User> {
    try {
      const user = await this.usersService.create(dto);
      return await this.usersService.findOneById(user.userId);
    } catch (error) {
      if (error.code === '23505')
        throw new BadRequestException('UserID already taken');

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
    res.cookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
      .cookie('refreshToken', '', { ...cookieOptions, maxAge: 0 });
  }

  @Post('refresh-token')
  public async refreshToken(@Request() req: Req, @Response() res: Res): Promise<void> {
    const login = await this.authService.loginWithRefreshToken(req.signedCookies?.refreshToken as string);
    if (login)
      res.cookie('accessToken', login.accessToken, cookieOptions).send();

    new BadRequestException('Missing refresh token');
  }

  @Get('me')
  public me(@Request() req: Req, @CurrentUser() user: User): TokenExpiringPayload & User {
    return this.addTokens(user, req.signedCookies as TokenExpiringPayload);
  }

  private addTokens(user: User, tokens: TokenExpiringPayload): TokenExpiringPayload & User {
    // @ts-expect-error: This is a hack to make the login response work with the frontend.
    user.accessTokenExpiresAt = tokens.accessTokenExpiresAt;
    // @ts-expect-error: This is a hack to make the login response work with the frontend.
    user.refreshTokenExpiresAt = tokens.refreshTokenExpiresAt;
    return user as TokenExpiringPayload & User;
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
