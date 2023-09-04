import { TeamRolesService } from './team-roles.service';
import {
  TeamRolesMutationResolver,
  TeamRolesQueryAggregateResolver,
  TeamRolesQueryResolver
} from './team-roles.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamRole } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TeamRole])],
  providers: [
    TeamRolesMutationResolver,
    TeamRolesQueryResolver,
    TeamRolesQueryAggregateResolver,
    TeamRolesService
  ],
  exports: [TeamRolesService],
})
export class TeamRolesModule {}