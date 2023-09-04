import { CampusClustersService } from './campus-clusters.service';
import {
  CampusClustersMutationResolver,
  CampusClustersQueryAggregateResolver,
  CampusClustersQueryResolver
} from './campus-clusters.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CampusCluster } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([CampusCluster])],
  providers: [
    CampusClustersMutationResolver,
    CampusClustersQueryResolver,
    CampusClustersQueryAggregateResolver,
    CampusClustersService
  ],
  exports: [CampusClustersService],
})
export class CampusClustersModule {}