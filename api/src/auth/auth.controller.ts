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
import type { CookieOptions } from 'express';
import { Request as Req, Response as Res } from 'express';
import { computedConfig, config } from '../shared/configs/config';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Public } from '../shared/lib/decorators/public.decorator';
import { SerializerIncludeEmail } from '../shared/lib/decorators/serializers.decorator';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { MyEfreiAuthGuard } from './myefrei-auth.guard';

const cookieOptions: Partial<CookieOptions> = {
  signed: true,
  secure: true,
  httpOnly: true,
  domain: config.get('baseUrl'),
};

@ApiTags('Authentication')
@SerializerIncludeEmail()
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

    res.cookie('accessToken', login.accessToken, cookieOptions)
      .cookie('refreshToken', login.refreshToken, cookieOptions);

    return user;
  }

  @Public()
  @UseGuards(MyEfreiAuthGuard)
  @Get('myefrei')
  public myefreiLogin(): void {
    // Logging in with MyEfrei! Everything is handled by the guard.
  }

  @Public()
  @UseGuards(MyEfreiAuthGuard)
  @Get('myefrei/callback')
  public async myefreiCallback(@CurrentUser() user: User, @Response() res: Res): Promise<void> {
    const login = await this.authService.login(user);

    res.cookie('accessToken', login.accessToken, cookieOptions)
      .cookie('refreshToken', login.refreshToken, cookieOptions)
      .cookie('accessTokenExpiresAt', login.accessTokenExpiresAt, { ...cookieOptions, httpOnly: false })
      .cookie('refreshTokenExpiresAt', login.refreshTokenExpiresAt, { ...cookieOptions, httpOnly: false })
      .redirect(`${computedConfig.frontendUrl}/#/auth`);
  }

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
  public me(@CurrentUser() user: User): User {
    return user;
  }
}
