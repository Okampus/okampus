import { AuthService } from './auth.service';
import { Requester } from '../../shards/decorators/requester.decorator';
import { loadConfig } from '../../shards/utils/load-config';

import { ConfigService } from '@nestjs/config';

import { Controller, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { User } from '@okampus/api/dal';
import type { CookieSerializeOptions } from '@fastify/cookie';
import type { FastifyReply } from 'fastify';

@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  cookieOptions: CookieSerializeOptions;
  cookiePublicOptions: CookieSerializeOptions;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const cookieConfig = loadConfig(this.configService, 'cookies');
    this.cookieOptions = cookieConfig.options;
    this.cookiePublicOptions = { ...cookieConfig.options, httpOnly: false };
  }
  @Post('ws-token')
  @ApiOperation({ summary: 'Issue websocket token.' })
  @ApiResponse({ status: 200, description: 'Issued WS token.' })
  public async wsToken(@Requester() user: User, @Res() res: FastifyReply): Promise<void> {
    await this.authService.addWebSocketTokenIfAuthenticated(res, user.id);
  }

  @Post('bot-token')
  @ApiOperation({ summary: 'Issue bot token.' })
  @ApiResponse({ status: 200, description: 'Issued bot token.' })
  public async botToken(@Param('id') id: string): Promise<string> {
    return await this.authService.createBotToken(id);
  }
}
