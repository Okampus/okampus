import { TextractService } from './textract.service';
import { TextractResolver } from './textract.resolver';
import { ConfigModule } from '@nestjs/config';

import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, Address } from '@okampus/api/dal';

@Global()
@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([Actor, Address])],
  providers: [TextractResolver, TextractService],
  exports: [TextractService],
})
export class TextractModule {}
