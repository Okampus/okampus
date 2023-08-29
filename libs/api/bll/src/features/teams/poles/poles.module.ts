import { PolesService } from './poles.service';
import { PolesMutationResolver, PolesQueryAggregateResolver, PolesQueryResolver } from './poles.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Pole } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Pole])],
  providers: [PolesMutationResolver, PolesQueryResolver, PolesQueryAggregateResolver, PolesService],
  exports: [PolesService],
})
export class PolesModule {}
