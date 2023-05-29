import { IndividualsService } from './individuals.service';
import {
  IndividualsMutationResolver,
  IndividualsQueryAggregateResolver,
  IndividualsQueryResolver,
} from './individuals.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Individual } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([Individual])],
  providers: [
    IndividualsMutationResolver,
    IndividualsQueryResolver,
    IndividualsQueryAggregateResolver,
    IndividualsService,
  ],
  exports: [IndividualsService],
})
export class IndividualsModule {}
