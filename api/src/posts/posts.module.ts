import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
import { UsersModule } from '../users/users.module';
import { PostReaction } from './entities/post-reaction.entity';
import { PostVote } from './entities/post-vote.entity';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostReactionsService } from './services/post-reactions.service';
import { PostVotesService } from './services/post-votes.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post, PostVote, PostReaction, Tag]),
    AuthModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [CaslAbilityFactory, PostsService, PostVotesService, PostReactionsService],
  exports: [PostsService],
})
export class PostsModule {}
