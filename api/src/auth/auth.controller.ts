import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { UserInterceptor } from '../shared/interceptors/user.interceptor';
import { User } from '../users/user.schema';
import { UserService } from '../users/users.service';
import type { TokenResponse } from './auth.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  public async login(@Body() body: LoginDto): Promise<TokenResponse> {
    return this.authService.login(
      await this.authService.validate(body.username, body.password),
    );
  }

  @Post('refresh-token')
  public async refreshToken(@Body('refreshToken') refreshToken: string): Promise<TokenResponse> {
    return this.authService.loginWithRefreshToken(refreshToken);
  }

  @Post('register')
  public async register(@Body() body: RegisterDto): Promise<TokenResponse> {
    if (await this.userService.getUserByName(body.username))
      throw new BadRequestException('Username already exists');

    if (await this.userService.getUserByEmail(body.email))
      throw new BadRequestException('Email already exists');

    const user = await this.userService.create(body);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('me')
  public me(@CurrentUser() user: User): User {
    return user;
  }
}
