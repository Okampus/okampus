import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { User } from '../users/user.entity';
import { ClubSearchService } from './club-search.service';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { ClubMember } from './entities/club-member.entity';
import { Club } from './entities/club.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Club, ClubMember, ProfileImage, User]),
  ],
  controllers: [ClubsController],
  providers: [CaslAbilityFactory, ClubsService, ClubSearchService],
  exports: [ClubsService],
})
export class ClubsModule implements OnModuleInit {
  constructor(
    private readonly clubSearchService: ClubSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.clubSearchService.init();
  }
}
