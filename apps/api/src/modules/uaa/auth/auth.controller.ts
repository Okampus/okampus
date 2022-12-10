import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  // UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { config } from '@configs/config';
import { CurrentTenant } from '@lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { Public } from '@lib/decorators/public.decorator';
import { RequestType } from '@lib/types/enums/request-type.enum';
import { TokenType } from '@lib/types/enums/token-type.enum';
import { addCookiesToResponse } from '@lib/utils/add-cookies-to-response';
import { Tenant } from '@tenants/tenant.entity';
import { User } from '@uaa/users/user.entity';
import { UsersService } from '@uaa/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { PreRegisterSsoDto } from './dto/pre-register-sso.dto';
import { RegisterDto } from './dto/register.dto';

const cookiePublicOptions = { ...config.cookies.options, httpOnly: false };

// TODO: manage sessions and revokable refresh tokens
@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Public()
  @Get('oidc-login')
  public async tenantLoginCallback(@CurrentUser() user: User, @Res() res: FastifyReply): Promise<void> {
    addCookiesToResponse(await this.authService.generateTokens(user), res);
    void res.redirect(303, `${config.network.frontendUrl + (config.env.isDev() ? '/#' : '')}/auth`);
  }

  @Public()
  @Post('login')
  public async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: FastifyReply): Promise<User> {
    const { user, tokens } = await this.authService.login(body);
    addCookiesToResponse(tokens, res);
    return user;
  }

  @CheckPolicies(ability => ability.can(Action.Create, User))
  @Post('register')
  public async register(@Body() dto: RegisterDto): Promise<User> {
    return await this.usersService.create(dto);
  }

  @CheckPolicies(ability => ability.can(Action.Create, User))
  @Post('pre-register-sso')
  public async preRegisterSso(@Body() dto: PreRegisterSsoDto, @CurrentTenant() tenant: Tenant): Promise<User> {
    return await this.authService.createOrUpdate(dto, tenant.slug);
  }

  @Public()
  @Get('logout')
  public logout(@Res({ passthrough: true }) res: FastifyReply): void {
    void res.clearCookie(config.cookies.names.access, config.cookies.options)
      .clearCookie(config.cookies.names.refresh, config.cookies.options)
      .clearCookie(config.cookies.names.accessExpiration, cookiePublicOptions)
      .clearCookie(config.cookies.names.refreshExpiration, cookiePublicOptions)
      .clearCookie(config.cookies.names.ws, cookiePublicOptions)
      .clearCookie(config.cookies.names.meilisearch, cookiePublicOptions);
  }

  @Post('ws-token')
  public async wsToken(@CurrentUser() user: User, @Res() res: FastifyReply): Promise<void> {
    addCookiesToResponse([
      await this.authService.generateToken({ sub: user.id, requestType: RequestType.WebSocket }, TokenType.WebSocket),
    ], res);
  }

  @Post('bot-token')
  public async botToken(@Param('botId') botId: string): Promise<string> {
    return await this.authService.generateBotToken(botId);
  }

  @Get('me')
  public me(@CurrentUser() user: User): User {
    return user;
  }
}
