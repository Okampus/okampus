import { UploadsService } from './uploads.service';
import { UploadsResolver } from './uploads.resolver';

import { HasuraModule } from '../../global/graphql/hasura.module';

import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [ConfigModule, HasuraModule],
  providers: [UploadsService, UploadsResolver],
  exports: [UploadsService],
})
export class UploadsModule {}
