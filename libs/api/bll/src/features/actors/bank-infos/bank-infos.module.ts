import { BankInfosService } from './bank-infos.service';
import { 
  BankInfosMutationResolver,
  BankInfosQueryAggregateResolver, 
  BankInfosQueryResolver
} from './bank-infos.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BankInfo } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([BankInfo])],
  providers: [
    BankInfosMutationResolver,
    BankInfosQueryResolver, 
    BankInfosQueryAggregateResolver,
    BankInfosService
  ],
  exports: [BankInfosService],
})
export class BankInfosModule {}