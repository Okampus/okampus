import { HasuraService } from './hasura.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({ imports: [ConfigModule], providers: [HasuraService], exports: [HasuraService] })
export class HasuraModule {}
