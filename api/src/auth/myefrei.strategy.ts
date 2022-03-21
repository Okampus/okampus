import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { BaseClient, ClientMetadata, TokenSet } from 'openid-client';
import { Client, Issuer, Strategy } from 'openid-client';
import { config } from '../shared/configs/config';
import type { MyEfreiUserinfoResponse } from '../shared/lib/types/interfaces/myefrei-userinfo-response.interface';
import { SchoolRole } from '../shared/modules/authorization/types/school-role.enum';
import type { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { MyEfreiDto } from './dto/myefrei.dto';

/* eslint-disable @typescript-eslint/naming-convention */
const clientOptions: ClientMetadata = {
  client_id: config.get('myefreiOidc.clientId'),
  client_secret: config.get('myefreiOidc.clientSecret'),
};

const paramOptions = {
  redirect_uri: config.get('myefreiOidc.callbackUri'),
  scope: config.get('myefreiOidc.scopes'),
};
/* eslint-enable @typescript-eslint/naming-convention */

export const buildOpenIdClient = async (): Promise<BaseClient> => {
  const TrustIssuer = await Issuer.discover(config.get('myefreiOidc.discoveryUrl'));
  return new TrustIssuer.Client(clientOptions);
};

@Injectable()
export class MyEfreiStrategy extends PassportStrategy(Strategy, 'myefrei') {
  private readonly client: BaseClient;

  constructor(
    private readonly authService: AuthService,
    client: Client,
  ) {
    super({
      client,
      params: paramOptions,
      usePKCE: false,
    });
    this.client = client;
  }

  public async validate(tokenset: TokenSet): Promise<User> {
    const data: MyEfreiUserinfoResponse = await this.client.userinfo(tokenset);

    if (!Object.values<string>(SchoolRole).includes(data.role))
      throw new UnauthorizedException('Invalid role');

    const userInfo = new MyEfreiDto(data);

    return await this.authService.createOrUpdate(userInfo);
  }
}
