import type { CanActivate } from '@nestjs/common';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { config } from '../../configs/config';

@Injectable()
export class TypesenseEnabledGuard implements CanActivate {
  public canActivate(): boolean {
    if (!config.get('typesense.enabled'))
      throw new ServiceUnavailableException('Search is disabled');
    return true;
  }
}
