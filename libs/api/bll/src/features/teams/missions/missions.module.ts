import { MissionsService } from './missions.service';
import { MissionsMutationResolver, MissionsQueryAggregateResolver, MissionsQueryResolver } from './missions.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Mission } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Mission])],
  providers: [MissionsMutationResolver, MissionsQueryResolver, MissionsQueryAggregateResolver, MissionsService],
  exports: [MissionsService],
})
export class MissionsModule {}
