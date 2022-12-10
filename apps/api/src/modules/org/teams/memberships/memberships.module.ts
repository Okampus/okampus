import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { TeamMember } from '@teams/members/team-member.entity';
import { TeamMembershipRequest } from '@teams/requests/team-membership-request.entity';
import { TeamMembershipsController } from './memberships.controller';
import { TeamMembershipsResolver } from './memberships.resolver';
import { TeamMembershipsService } from './memberships.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamMember, TeamMembershipRequest]),
  ],
  controllers: [TeamMembershipsController],
  providers: [CaslAbilityFactory, TeamMembershipsService, TeamMembershipsResolver],
  exports: [TeamMembershipsService],
})
export class TeamMembershipsModule {}
