import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { TeamMember } from '../members/team-member.entity';
import { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { TeamMembershipsController } from './memberships.controller';
import { TeamMembershipsService } from './memberships.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamMember, TeamMembershipRequest]),
  ],
  controllers: [TeamMembershipsController],
  providers: [CaslAbilityFactory, TeamMembershipsService],
  exports: [TeamMembershipsService],
})
export class TeamMembershipsModule {}
