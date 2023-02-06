// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../../global/config.module';

import { Requester } from '../../../shards/request-context/requester.decorator';
import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public, TenantPublic } from '@okampus/api/shards';
import { TokenType } from '@okampus/shared/enums';
import { referenceRemover } from '@okampus/shared/utils';
import type { ApiConfig, Snowflake } from '@okampus/shared/types';
import type { User } from '@okampus/api/dal';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthContextModel } from './auth-context.model';
import type { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';

// TODO: manage sessions and revokable refresh tokens
@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  config: ApiConfig;

  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    this.config = this.configService.config;
  }

  @Public()
  @Get('oidc-callback')
  public async oidcLoginCallback(
    @Requester() user: User,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ): Promise<void> {
    await this.authService.addTokensOnAuth(req, res, user.id);
    res.redirect(303, `${this.config.network.frontendUrl}/auth`);
  }

  @TenantPublic()
  @Post('login')
  public async login(
    @Body() body: LoginDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ): Promise<AuthContextModel> {
    return referenceRemover(await this.authService.login(body, req, res));
  }

  // @CheckPolicies((ability) => ability.can(Action.Create, User))
  // @Post('register')
  // public async register(@Body() dto: RegisterDto): Promise<User> {
  //   return await this.usersService.create(dto);
  // }

  // @CheckPolicies((ability) => ability.can(Action.Create, User))
  // @Post('pre-register-sso')
  // public async preRegisterSso(@Body() dto: PreRegisterSsoDto, @ForTenant() tenant: TenantCore): Promise<User> {
  //   return await this.authService.createOrUpdate(dto, tenant.domain);
  // }

  @Public()
  @Get('logout')
  public logout(@Res({ passthrough: true }) res: FastifyReply): void {
    const cookiePublicOptions = { ...this.config.cookies.options, httpOnly: false };
    void res
      .clearCookie(this.config.cookies.names[TokenType.Access], this.config.cookies.options)
      .clearCookie(this.config.cookies.names[TokenType.Refresh], this.config.cookies.options)
      .clearCookie(this.config.cookies.names.AccessExpiration, cookiePublicOptions)
      .clearCookie(this.config.cookies.names.RefreshExpiration, cookiePublicOptions)
      .clearCookie(this.config.cookies.names[TokenType.WebSocket], cookiePublicOptions)
      .clearCookie(this.config.cookies.names[TokenType.MeiliSearch], cookiePublicOptions);
  }

  @Post('ws-token')
  public async wsToken(@Requester() user: User, @Res() res: FastifyReply): Promise<void> {
    await this.authService.addWebSocketTokenIfAuthenticated(res, user.id);
  }

  @Post('bot-token')
  public async botToken(@Param('id') id: Snowflake): Promise<string> {
    return await this.authService.createBotToken(id);
  }

  @Get('me')
  public me(@Requester() user: User): User {
    return user;
  }
}
