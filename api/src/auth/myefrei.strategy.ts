import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type {
  BaseClient,
  ClientMetadata,
  TokenSet,
  UserinfoResponse,
} from 'openid-client';
import { Client, Issuer, Strategy } from 'openid-client';
import { config } from '../shared/configs/config';
import type { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { MyEfreiDto } from './dto/myefrei.dto';

/* eslint-disable @typescript-eslint/naming-convention */
const clientOptions: ClientMetadata = {
  client_id: config.get('myefreiOidcClientId'),
  client_secret: config.get('myefreiOidcClientSecret'),
};

const paramOptions = {
  redirect_uri: 'https://api.horizon-efrei.fr/auth/myefrei/callback',
  scope: config.get('myefreiOidcScopes'),
};
/* eslint-enable @typescript-eslint/naming-convention */

export const buildOpenIdClient = async (): Promise<BaseClient> => {
  const TrustIssuer = await Issuer.discover(config.get('myefreiOidcDiscoveryUrl'));
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
    const data: UserinfoResponse = await this.client.userinfo(tokenset);
    const userInfo = new MyEfreiDto(data);

    return await this.authService.createOrUpdate(userInfo);
  }
}
