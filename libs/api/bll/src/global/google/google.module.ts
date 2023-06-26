import { GoogleService } from './google.service';
import { GoogleResolver } from './google.resolver';
import { ConfigModule } from '@nestjs/config';

import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, Address } from '@okampus/api/dal';

@Global()
@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([Actor, Address])],
  providers: [GoogleResolver, GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
