import { FormSubmissionsService } from './form-submissions.service';
import {
  FormSubmissionsMutationResolver,
  FormSubmissionsQueryAggregateResolver,
  FormSubmissionsQueryResolver,
} from './form-submissions.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FormSubmission } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([FormSubmission])],
  providers: [
    FormSubmissionsMutationResolver,
    FormSubmissionsQueryResolver,
    FormSubmissionsQueryAggregateResolver,
    FormSubmissionsService,
  ],
  exports: [FormSubmissionsService],
})
export class FormSubmissionsModule {}
