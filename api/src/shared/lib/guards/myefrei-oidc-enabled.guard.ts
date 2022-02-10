import type { CanActivate } from '@nestjs/common';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { config } from '../../configs/config';

@Injectable()
export class MyEfreiOidcEnabledGuard implements CanActivate {
  public canActivate(): boolean {
    if (!config.get('myefreiOidc.enabled'))
      throw new ServiceUnavailableException('MyEfrei OpenID Connection is disabled');
    return true;
  }
}
