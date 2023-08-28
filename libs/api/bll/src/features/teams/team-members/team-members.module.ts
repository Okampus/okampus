import { TeamMembersService } from './team-members.service';
import { 
  TeamMembersMutationResolver,
  TeamMembersQueryAggregateResolver, 
  TeamMembersQueryResolver
} from './team-members.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TeamMember } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TeamMember])],
  providers: [
    TeamMembersMutationResolver,
    TeamMembersQueryResolver, 
    TeamMembersQueryAggregateResolver,
    TeamMembersService
  ],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}