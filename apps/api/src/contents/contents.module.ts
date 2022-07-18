import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Favorite } from '../favorites/favorite.entity';
import { PubSubModule } from '../pub-sub.module';
import { Reaction } from '../reactions/reaction.entity';
import { Report } from '../reports/report.entity';
import { ContentMaster } from '../shared/lib/entities/content-master.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { MailModule } from '../shared/modules/mail/mail.module';
import { Validation } from '../validations/entities/validation.entity';
import { Vote } from '../votes/vote.entity';
import { VotesModule } from '../votes/votes.module';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { ContentEdit } from './entities/content-edit.entity';
import { Content } from './entities/content.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Content,
      ContentEdit,
      ContentMaster,
      Validation,
      Favorite,
      Reaction,
      Vote,
      Report,
    ]),
    MailModule,
    PubSubModule,
    VotesModule,
  ],
  controllers: [ContentsController],
  providers: [CaslAbilityFactory, ContentsService],
  exports: [ContentsService],
})
export class ContentsModule {}
