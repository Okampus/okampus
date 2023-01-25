import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@okampus/api/dal';
import { Public, TenantPublic } from '@okampus/api/shards';
import { TokenType } from '@okampus/shared/enums';
import { ApiConfig, UUID } from '@okampus/shared/types';
import { referenceRemover } from '@okampus/shared/utils';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UserModel } from '../../../domains/factories/users/user.model';
import { UsersService } from '../../../domains/resources/users/users.service';
import { ConfigService } from '../../../global/config.module';
import { Requester } from '../../../shards/global-request/current-user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';

// TODO: manage sessions and revokable refresh tokens
@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  config: ApiConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {
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
  ): Promise<UserModel> {
    const model = await this.authService.login(body, req, res);
    console.log(referenceRemover(model));
    return referenceRemover(model);
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
  public async botToken(@Param('id') id: UUID): Promise<string> {
    return await this.authService.createBotToken(id);
  }

  @Get('me')
  public me(@Requester() user: User): User {
    return user;
  }
}
