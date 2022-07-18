import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ContentsModule } from '../contents/contents.module';
import { Content } from '../contents/entities/content.entity';
import { PubSubModule } from '../pub-sub.module';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { Validation } from '../validations/entities/validation.entity';
import { ValidationsModule } from '../validations/validations.module';
import { ThreadSearchService } from './thread-search.service';
import { Thread } from './thread.entity';
import { ThreadsController } from './threads.controller';
import { ThreadResolver } from './threads.resolver';
import { ThreadsService } from './threads.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Thread,
      Tag,
      User,
      Content,
      Validation,
    ]),
    ContentsModule,
    ValidationsModule,
    PubSubModule,
  ],
  controllers: [ThreadsController],
  providers: [CaslAbilityFactory, ThreadsService, ThreadSearchService, ThreadResolver],
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
