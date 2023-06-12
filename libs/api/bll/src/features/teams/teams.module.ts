import { TeamsService } from './teams.service';
import { TeamsMutationResolver, TeamsQueryAggregateResolver, TeamsQueryResolver } from './teams.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Team } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([Team])],
  providers: [TeamsMutationResolver, TeamsQueryResolver, TeamsQueryAggregateResolver, TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}