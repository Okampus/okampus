import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Favorite } from '../favorites/favorite.entity';
import { FavoritesModule } from '../favorites/favorites.module';
import { Reaction } from '../reactions/reaction.entity';
import { Report } from '../reports/report.entity';
import { ReportsModule } from '../reports/reports.module';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { MailModule } from '../shared/modules/mail/mail.module';
import { PubSubModule } from '../shared/modules/pub-sub/pub-sub.module';
import { ValidationsModule } from '../validations/validations.module';
import { Vote } from '../votes/vote.entity';
import { VotesModule } from '../votes/votes.module';
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
      Vote,
    ]),
    MailModule,
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
