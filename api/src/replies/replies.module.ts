import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Post } from '../posts/entities/post.entity';
import { ReplyVote } from './entities/reply-vote.entity';
import { Reply } from './entities/reply.entity';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { ReplyVotesService } from './reply-votes.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post, Reply, ReplyVote]),
    AuthModule,
  ],
  controllers: [RepliesController],
  providers: [RepliesService, ReplyVotesService],
  exports: [RepliesService],
})
export class RepliesModule {}
