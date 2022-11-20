import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ContentMaster } from '../../shared/lib/entities/content-master.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../../shared/modules/notifications/notifications.module';
import { PubSubModule } from '../../shared/modules/pub-sub/pub-sub.module';
import { User } from '../../uua/users/user.entity';
import { ValidationsModule } from '../../validations/validations.module';
import { Favorite } from '../interact/favorites/favorite.entity';
import { FavoritesModule } from '../interact/favorites/favorites.module';
import { Reaction } from '../interact/reactions/reaction.entity';
import { Report } from '../interact/reports/report.entity';
import { ReportsModule } from '../interact/reports/reports.module';
import { Vote } from '../interact/votes/vote.entity';
import { VotesModule } from '../interact/votes/votes.module';
import { ContentsController } from './contents.controller';
import { ContentResolver } from './contents.resolver';
import { ContentsService } from './contents.service';
import { ContentEdit } from './entities/content-edit.entity';
import { Content } from './entities/content.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Content,
      ContentEdit,
      ContentMaster,
      Favorite,
      Reaction,
      Report,
      User,
      Vote,
    ]),
    NotificationsModule,
    PubSubModule,
    VotesModule,
    FavoritesModule,
    ReportsModule,
    ValidationsModule,
  ],
  controllers: [ContentsController],
  providers: [CaslAbilityFactory, ContentsService, ContentResolver],
  exports: [ContentsService],
})
export class ContentsModule {}
