import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Post } from '../posts/entities/post.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { ReplyVote } from './entities/reply-vote.entity';
import { Reply } from './entities/reply.entity';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { ReplyVotesService } from './services/reply-votes.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post, Reply, ReplyVote]),
  ],
  controllers: [RepliesController],
  providers: [CaslAbilityFactory, RepliesService, ReplyVotesService],
  exports: [RepliesService],
})
export class RepliesModule {}
