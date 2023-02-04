import type { Strategy } from 'openid-client';
import { Global, Injectable, Module } from '@nestjs/common';
import type { User } from '@okampus/api/dal';

@Injectable()
export class OIDCCacheService {
  public strategies = new Map<string, Strategy<User>>();
}

@Global()
@Module({
  providers: [OIDCCacheService],
  exports: [OIDCCacheService],
})
export class OIDCCacheModule {}
