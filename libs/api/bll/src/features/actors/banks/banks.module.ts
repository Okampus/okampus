import { BanksService } from './banks.service';
import { 
  BanksMutationResolver,
  BanksQueryAggregateResolver, 
  BanksQueryResolver
} from './banks.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Bank } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Bank])],
  providers: [
    BanksMutationResolver,
    BanksQueryResolver, 
    BanksQueryAggregateResolver,
    BanksService
  ],
  exports: [BanksService],
})
export class BanksModule {}