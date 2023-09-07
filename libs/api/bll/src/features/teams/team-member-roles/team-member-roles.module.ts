import { TeamMemberRolesService } from './team-member-roles.service';
import {
  TeamMemberRolesMutationResolver,
  TeamMemberRolesQueryAggregateResolver,
  TeamMemberRolesQueryResolver
} from './team-member-roles.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamMemberRole } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TeamMemberRole])],
  providers: [
    TeamMemberRolesMutationResolver,
    TeamMemberRolesQueryResolver,
    TeamMemberRolesQueryAggregateResolver,
    TeamMemberRolesService
  ],
  exports: [TeamMemberRolesService],
})
export class TeamMemberRolesModule {}