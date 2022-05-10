import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { TeamMember } from '../members/team-member.entity';
import { Team } from '../teams/team.entity';
import { TeamMembershipRequestsController } from './requests.controller';
import { TeamMembershipRequestsService } from './requests.service';
import { TeamMembershipRequest } from './team-membership-request.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, TeamMembershipRequest]),
  ],
  controllers: [TeamMembershipRequestsController],
  providers: [CaslAbilityFactory, TeamMembershipRequestsService],
  exports: [TeamMembershipRequestsService],
})
export class TeamMembershipRequestsModule {}
