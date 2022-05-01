import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { User } from '../users/user.entity';
import { TeamMember } from './entities/team-member.entity';
import { TeamMembershipRequest } from './entities/team-membership-request.entity';
import { Team } from './entities/team.entity';
import { TeamSearchService } from './team-search.service';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, TeamMembershipRequest, ProfileImage, User]),
  ],
  controllers: [TeamsController],
  providers: [CaslAbilityFactory, TeamsService, TeamSearchService],
  exports: [TeamsService],
})
export class TeamsModule implements OnModuleInit {
  constructor(
    private readonly teamSearchService: TeamSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.teamSearchService.init();
  }
}
