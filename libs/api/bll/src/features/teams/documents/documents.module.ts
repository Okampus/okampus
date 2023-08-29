import { DocumentsService } from './documents.service';
import {
  DocumentsMutationResolver,
  DocumentsQueryAggregateResolver,
  DocumentsQueryResolver,
} from './documents.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Document } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Document])],
  providers: [DocumentsMutationResolver, DocumentsQueryResolver, DocumentsQueryAggregateResolver, DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
