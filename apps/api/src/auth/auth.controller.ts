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
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import type { TokenResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { MyEfreiAuthGuard } from './myefrei-auth.guard';

const cookieOptions = config.get('cookies.options');
const cookiePublicOptions = { ...config.get('cookies.options'), httpOnly: false };

@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('login')
  public async login(@Body() body: LoginDto, @Response({ passthrough: true }) res: Res): Promise<User> {
    const user = await this.authService.validatePassword(body.username, body.password);
    const login = await this.authService.login(user);

    // @ts-expect-error: This is a hack to make the login response work with the frontend.
    user.accessTokenExpiresAt = login.accessTokenExpiresAt.toString();
    // @ts-expect-error: This is a hack to make the login response work with the frontend.
    user.refreshTokenExpiresAt = login.refreshTokenExpiresAt.toString();

    this.addAuthCookies(res, login);

    return user;
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
  public me(
    @Request() req: Req,
    @CurrentUser() user: User & { accessTokenExpiresAt: string; refreshTokenExpiresAt: string },
  ): User & { accessTokenExpiresAt: string; refreshTokenExpiresAt: string } {
    user.accessTokenExpiresAt = req.signedCookies.accessTokenExpiresAt;
    user.refreshTokenExpiresAt = req.signedCookies.refreshTokenExpiresAt;

    return user;
  }

  private addAuthCookies(res: Res, tokens: TokenResponse): Res {
    return res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: config.get('tokens.accessTokenExpirationSeconds') * 1000 })
      .cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: config.get('tokens.refreshTokenExpirationSeconds') * 1000 })
      .cookie('accessTokenExpiresAt', tokens.accessTokenExpiresAt, cookiePublicOptions)
      .cookie('refreshTokenExpiresAt', tokens.refreshTokenExpiresAt, cookiePublicOptions);
  }
}
