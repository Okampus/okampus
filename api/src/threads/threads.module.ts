import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Content } from '../contents/content.entity';
import { ContentsModule } from '../contents/contents.module';
import { Favorite } from '../favorites/favorite.entity';
import { Reaction } from '../reactions/reaction.entity';
import { Report } from '../reports/report.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { Vote } from '../votes/vote.entity';
import { Thread } from './thread.entity';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Thread,
      Tag,
      User,
      Content,
      Favorite,
      Reaction,
      Vote,
      Report,
    ]),
    ContentsModule,
  ],
  controllers: [ThreadsController],
  providers: [CaslAbilityFactory, ThreadsService],
  exports: [ThreadsService],
})
export class ThreadsModule {}
