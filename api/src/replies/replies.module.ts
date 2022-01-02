import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Post } from '../posts/entities/post.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { ReplyReaction } from './entities/reply-reaction.entity';
import { ReplyVote } from './entities/reply-vote.entity';
import { Reply } from './entities/reply.entity';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { ReplyReactionsService } from './services/reply-reactions.service';
import { ReplyVotesService } from './services/reply-votes.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post, Reply, ReplyVote, ReplyReaction]),
    AuthModule,
  ],
  controllers: [RepliesController],
  providers: [CaslAbilityFactory, RepliesService, ReplyVotesService, ReplyReactionsService],
  exports: [RepliesService],
})
export class RepliesModule {}
