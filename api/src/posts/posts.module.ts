import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
import { PostVote } from './entities/post-vote.entity';
import { Post } from './entities/post.entity';
import { PostVotesService } from './post-votes.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post, PostVote, Tag]),
  ],
  controllers: [PostsController],
  providers: [CaslAbilityFactory, PostsService, PostVotesService],
  exports: [PostsService],
})
export class PostsModule {}
