import { NationalIdentificationService } from './national-identification.service';
import { NationalIdentificationResolver } from './national-identification.resolver';
import { ConfigModule } from '@nestjs/config';

import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, Address } from '@okampus/api/dal';

@Global()
@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([Actor, Address])],
  providers: [NationalIdentificationResolver, NationalIdentificationService],
  exports: [NationalIdentificationService],
})
export class NationalIdentificationModule {}
