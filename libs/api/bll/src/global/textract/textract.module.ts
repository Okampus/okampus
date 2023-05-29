import { TextractService } from './textract.service';
import { TextractResolver } from './textract.resolver';
import { ConfigModule } from '@nestjs/config';

import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, ActorAddress } from '@okampus/api/dal';

@Global()
@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([Actor, ActorAddress])],
  providers: [TextractResolver, TextractService],
  exports: [TextractService],
})
export class TextractModule {}
