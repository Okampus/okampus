import { CampusesService } from './campuses.service';
import {
  CampusesMutationResolver,
  CampusesQueryAggregateResolver,
  CampusesQueryResolver
} from './campuses.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Campus } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Campus])],
  providers: [
    CampusesMutationResolver,
    CampusesQueryResolver,
    CampusesQueryAggregateResolver,
    CampusesService
  ],
  exports: [CampusesService],
})
export class CampusesModule {}