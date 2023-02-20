// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../../global/config.module';

import { Requester } from '../../../shards/decorators/requester.decorator';
import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public, TenantPublic } from '@okampus/api/shards';
import { TokenType } from '@okampus/shared/enums';
import { referenceRemover } from '@okampus/shared/utils';

import type { Snowflake } from '@okampus/shared/types';
import type { User } from '@okampus/api/dal';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthContextModel } from './auth-context.model';
import type { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {}

  @Public()
  @Get('oidc-callback')
  public async oidcLoginCallback(
    @Requester() user: User,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ): Promise<void> {
    await this.authService.addTokensOnAuth(req, res, user.id);
    res.redirect(303, `${this.configService.config.network.frontendUrl}/auth`);
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

  @Public()
  @Get('logout')
  public logout(@Res({ passthrough: true }) res: FastifyReply): void {
    const { names, options } = this.configService.config.cookies;
    const cookiePublicOptions = { ...options, httpOnly: false };
    void res
      .clearCookie(names[TokenType.Access], options)
      .clearCookie(names[TokenType.Refresh], options)
      .clearCookie(names.AccessExpiration, cookiePublicOptions)
      .clearCookie(names.RefreshExpiration, cookiePublicOptions)
      .clearCookie(names[TokenType.WebSocket], cookiePublicOptions)
      .clearCookie(names[TokenType.MeiliSearch], cookiePublicOptions);
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
