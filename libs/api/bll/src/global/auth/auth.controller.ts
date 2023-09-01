import { AuthService } from './auth.service';
import { Requester } from '../../shards/decorators/requester.decorator';
import { loadConfig } from '../../shards/utils/load-config';

import { ConfigService } from '@nestjs/config';

import { BadRequestException, Controller, Get, HttpCode, Param, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@okampus/api/shards';
import { isNonNullObject } from '@okampus/shared/utils';

import { parse } from 'graphql';

import type { User } from '@okampus/api/dal';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CookieSerializeOptions } from '@fastify/cookie';

type HasuraAuth = { 'x-hasura-role': string };

@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  authUrl: string;
  cookieOptions: CookieSerializeOptions;
  cookiePublicOptions: CookieSerializeOptions;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const frontendUrl = loadConfig(this.configService, 'network.frontendUrl');
    this.authUrl = `${frontendUrl}/auth`;

    const cookieConfig = loadConfig(this.configService, 'cookies');
    this.cookieOptions = cookieConfig.options;
    this.cookiePublicOptions = { ...cookieConfig.options, httpOnly: false };
  }

  @Public()
  @Get('oidc-callback')
  public async oidcLoginCallback(
    @Requester() user: User,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    await this.authService.refreshSession(req, res, user.id);
    res.redirect(303, this.authUrl);
  }

  @Public()
  @Post('hasura')
  @HttpCode(200)
  public async hasuraAuth(@Req() req: FastifyRequest): Promise<HasuraAuth> {
    // Correct Hasura auth header
    const body = req.body;
    if (!isNonNullObject(body) || !('headers' in body) || !isNonNullObject(body.headers))
      throw new BadRequestException('Headers missing in Hasura auth request.');

    if (!('request' in body) || !isNonNullObject(body.request))
      throw new BadRequestException('Request field missing in Hasura auth request.');

    if (!('query' in body.request) || typeof body.request.query !== 'string')
      throw new BadRequestException('Query missing in Hasura auth request.');

    const query = parse(body.request.query);
    const operations = query.definitions.filter((definition) => definition.kind == 'OperationDefinition');

    if (
      operations.length === 1 &&
      'selectionSet' in operations[0] &&
      'selections' in operations[0].selectionSet &&
      operations[0].selectionSet.selections.length === 1 &&
      operations[0].selectionSet.selections[0].kind === 'Field' &&
      operations[0].selectionSet.selections[0].name.value === '__schema'
    ) {
      return { 'x-hasura-role': 'admin' }; // Allow introspection with admin role // TODO: major security issue, check if correct
    }

    return { 'x-hasura-role': 'admin' };
    // if (query.trim().startsWith('query IntrospectionQuery {')) return { 'x-hasura-role': 'anonymous' };
    // throw new BadRequestException('Invalid Hasura auth request');
    // const { sub } = await this.validateAccessToken(req.cookies.access);
    // await this.addTokensOnAuth(req, res, sub);
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
