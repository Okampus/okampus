import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { Announcement } from './announcement.entity';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Announcement]),
  ],
  controllers: [AnnouncementsController],
  providers: [CaslAbilityFactory, AnnouncementsService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
