import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { FileUploadsModule } from '../../files/file-uploads/file-uploads.module';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { ProfileImagesModule } from '../../files/profile-images/profile-images.module';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { TeamForm } from '../forms/team-form.entity';
import { TeamMember } from '../members/team-member.entity';
import { TeamSearchService } from './team-search.service';
import { Team } from './team.entity';
import { TeamsController } from './teams.controller';
import { TeamsResolver } from './teams.resolver';
import { TeamsService } from './teams.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Team, TeamMember, TeamForm, ProfileImage]),
    FileUploadsModule,
    ProfileImagesModule,
  ],
  controllers: [TeamsController],
  providers: [CaslAbilityFactory, TeamsService, TeamSearchService, TeamsResolver],
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
