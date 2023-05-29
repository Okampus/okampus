import { FormsService } from './forms.service';
import { FormsMutationResolver, FormsQueryAggregateResolver, FormsQueryResolver } from './forms.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Form } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([Form])],
  providers: [FormsMutationResolver, FormsQueryResolver, FormsQueryAggregateResolver, FormsService],
  exports: [FormsService],
})
export class FormsModule {}
