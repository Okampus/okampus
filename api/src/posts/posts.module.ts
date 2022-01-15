import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { PostVote } from './entities/post-vote.entity';
import { Post } from './entities/post.entity';
import { PostSearchService } from './post-search.service';
import { PostVotesService } from './post-votes.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post, PostVote, Tag, User]),
  ],
  controllers: [PostsController],
  providers: [CaslAbilityFactory, PostsService, PostVotesService, PostSearchService],
  exports: [PostsService],
})
export class PostsModule implements OnModuleInit {
  constructor(
    private readonly postSearchService: PostSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.postSearchService.init();
  }
}
