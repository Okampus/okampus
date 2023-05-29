import { GeocodeService } from './geocode.service';
import { GeocodeResolver } from './geocode.resolver';
import { ConfigModule } from '@nestjs/config';

import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, ActorAddress } from '@okampus/api/dal';

@Global()
@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([Actor, ActorAddress])],
  providers: [GeocodeResolver, GeocodeService],
  exports: [GeocodeService],
})
export class GeocodeModule {}
