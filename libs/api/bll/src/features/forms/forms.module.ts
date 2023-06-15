import { FormsService } from './forms.service';
import { FormsQueryAggregateResolver, FormsQueryResolver } from './forms.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { LogsModule } from '../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Form } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Form])],
  providers: [FormsQueryResolver, FormsQueryAggregateResolver, FormsService],
  exports: [FormsService],
})
export class FormsModule {}
