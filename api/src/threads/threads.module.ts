import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ContentsModule } from '../contents/contents.module';
import { Content } from '../contents/entities/content.entity';
import { Favorite } from '../favorites/favorite.entity';
import { Reaction } from '../reactions/reaction.entity';
import { Report } from '../reports/report.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { Vote } from '../votes/vote.entity';
import { ThreadSearchService } from './thread-search.service';
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
  providers: [CaslAbilityFactory, ThreadsService, ThreadSearchService],
  exports: [ThreadsService],
})
export class ThreadsModule implements OnModuleInit {
  constructor(
    private readonly threadSearchService: ThreadSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.threadSearchService.init();
  }
}
