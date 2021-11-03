import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Comment } from '../comments/entities/comment.entity';
import { ReplyVote } from './entities/reply-vote.entity';
import { Reply } from './entities/reply.entity';
import { ReplyVotesService } from './replies-votes.service';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Comment, Reply, ReplyVote]),
    AuthModule,
  ],
  controllers: [RepliesController],
  providers: [RepliesService, ReplyVotesService],
  exports: [RepliesService],
})
export class RepliesModule {}
