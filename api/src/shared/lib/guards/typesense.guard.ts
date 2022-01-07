import type { CanActivate } from '@nestjs/common';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { config } from '../../../config';

@Injectable()
export class TypesenseGuard implements CanActivate {
  public canActivate(): boolean {
    if (!config.get('typesenseEnabled'))
      throw new ServiceUnavailableException('Search is disabled');
    return true;
  }
}
