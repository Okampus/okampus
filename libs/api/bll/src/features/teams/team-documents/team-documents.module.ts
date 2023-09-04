import { TeamDocumentsService } from './team-documents.service';
import {
  TeamDocumentsMutationResolver,
  TeamDocumentsQueryAggregateResolver,
  TeamDocumentsQueryResolver
} from './team-documents.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamDocument } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TeamDocument])],
  providers: [
    TeamDocumentsMutationResolver,
    TeamDocumentsQueryResolver,
    TeamDocumentsQueryAggregateResolver,
    TeamDocumentsService
  ],
  exports: [TeamDocumentsService],
})
export class TeamDocumentsModule {}