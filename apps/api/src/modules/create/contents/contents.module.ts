import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@common/modules/notifications/notifications.module';
import { PubSubModule } from '@common/modules/pub-sub/pub-sub.module';
import { Favorite } from '@interact/favorites/favorite.entity';
import { Reaction } from '@interact/reactions/reaction.entity';
import { Report } from '@interact/reports/report.entity';
import { Vote } from '@interact/votes/vote.entity';
import { ContentMaster } from '@lib/entities/content-master.entity';
import { User } from '@uaa/users/user.entity';
import { ContentsController } from './contents.controller';
import { ContentResolver } from './contents.resolver';
import { ContentsService } from './contents.service';
import { Content } from './entities/content.entity';
import { Edit } from './entities/edit.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Content,
      Edit,
      ContentMaster,
      Favorite,
      Reaction,
      Report,
      User,
      Vote,
    ]),
    NotificationsModule,
    PubSubModule,
  ],
  controllers: [ContentsController],
  providers: [CaslAbilityFactory, ContentsService, ContentResolver],
  exports: [ContentsService],
})
export class ContentsModule {}
