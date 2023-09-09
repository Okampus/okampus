import { TeamRequiredRolesService } from './team-required-roles.service';
import {
  TeamRequiredRolesMutationResolver,
  TeamRequiredRolesQueryAggregateResolver,
  TeamRequiredRolesQueryResolver,
} from './team-required-roles.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamRequiredRole } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TeamRequiredRole])],
  providers: [
    TeamRequiredRolesMutationResolver,
    TeamRequiredRolesQueryResolver,
    TeamRequiredRolesQueryAggregateResolver,
    TeamRequiredRolesService,
  ],
  exports: [TeamRequiredRolesService],
})
export class TeamRequiredRolesModule {}
