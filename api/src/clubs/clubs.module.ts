import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { ClubMember } from './club-member.entity';
import { ClubSearchService } from './club-search.service';
import { Club } from './club.entity';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Club, ClubMember, User]),
    UsersModule,
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
