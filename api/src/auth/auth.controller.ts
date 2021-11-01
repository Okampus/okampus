import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { CookieOptions } from 'express';
import { Request as Req, Response as Res } from 'express';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { UserInterceptor } from '../shared/interceptors/user.interceptor';
import { User } from '../users/user.schema';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

const cookieOptions: Partial<CookieOptions> = {
  signed: true,
  httpOnly: true,
  sameSite: 'strict',
};

@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseInterceptors(UserInterceptor)
  @Post('register')
  public async register(@Body() body: RegisterDto, @Response({ passthrough: true }) res: Res): Promise<User> {
    if (await this.userService.getUserByName(body.username))
      throw new BadRequestException('Username already exists');

    if (await this.userService.getUserByEmail(body.email))
      throw new BadRequestException('Email already exists');

    const user = await this.userService.create(body);
    const login = await this.authService.login(body as User);
    res.cookie('accessToken', login.accessToken, cookieOptions)
      .cookie('refreshToken', login.refreshToken, cookieOptions);

    return user;
  }

  @UseInterceptors(UserInterceptor)
  @Post('login')
  public async login(@Body() body: LoginDto, @Response({ passthrough: true }) res: Res): Promise<User> {
    const user = await this.authService.validate(body.username, body.password);
    const login = await this.authService.login(user);

    res.cookie('accessToken', login.accessToken, cookieOptions)
      .cookie('refreshToken', login.refreshToken, cookieOptions);

    return user;
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('me')
  public me(@CurrentUser() user: User): User {
    return user;
  }
}
