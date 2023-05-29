import { FollowsService } from './follows.service';
import { FollowsMutationResolver, FollowsQueryAggregateResolver, FollowsQueryResolver } from './follows.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Follow } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([Follow])],
  providers: [FollowsMutationResolver, FollowsQueryResolver, FollowsQueryAggregateResolver, FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
