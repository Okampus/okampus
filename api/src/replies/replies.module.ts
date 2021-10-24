import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Vote, VoteSchema } from '../shared/schemas/vote.schema';
import { ReplyVotesService } from './replies-votes.service';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { ReplyVote, ReplyVoteSchema } from './schemas/reply-vote.schema';
import { Reply, ReplySchema } from './schemas/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reply.name,
        schema: ReplySchema,
      },
      {
        name: Vote.name,
        schema: VoteSchema,
        discriminators: [
          { name: ReplyVote.name, schema: ReplyVoteSchema },
        ],
      },
    ]),
    AuthModule,
  ],
  controllers: [RepliesController],
  providers: [RepliesService, ReplyVotesService],
})
export class RepliesModule {}
