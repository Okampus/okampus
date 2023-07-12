import { Global, Injectable, Module } from '@nestjs/common';
import type { Individual } from '@okampus/api/dal';
import type { Strategy } from 'openid-client';

@Injectable()
export class OIDCCacheService {
  public strategies = new Map<string, Strategy<Individual>>();
}

@Global()
@Module({ providers: [OIDCCacheService], exports: [OIDCCacheService] })
export class OIDCCacheModule {}
