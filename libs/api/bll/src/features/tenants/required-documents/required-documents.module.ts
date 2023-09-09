import { RequiredDocumentsService } from './required-documents.service';
import {
  RequiredDocumentsMutationResolver,
  RequiredDocumentsQueryAggregateResolver,
  RequiredDocumentsQueryResolver,
} from './required-documents.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RequiredDocument } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([RequiredDocument])],
  providers: [
    RequiredDocumentsMutationResolver,
    RequiredDocumentsQueryResolver,
    RequiredDocumentsQueryAggregateResolver,
    RequiredDocumentsService,
  ],
  exports: [RequiredDocumentsService],
})
export class RequiredDocumentsModule {}
