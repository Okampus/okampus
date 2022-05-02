import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { TeamMember } from '../members/team-member.entity';
import { TeamSearchService } from './team-search.service';
import { Team } from './team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, ProfileImage]),
  ],
  controllers: [TeamsController],
  providers: [CaslAbilityFactory, TeamsService, TeamSearchService],
  exports: [TeamsService],
})
export class CoreTeamsModule implements OnModuleInit {
  constructor(
    private readonly teamSearchService: TeamSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.teamSearchService.init();
  }
}
