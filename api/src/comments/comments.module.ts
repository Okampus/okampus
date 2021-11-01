import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Vote, VoteSchema } from '../shared/schemas/vote.schema';
import { CommentVotesService } from './comment-votes.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentVote, CommentVoteSchema } from './schemas/comment-vote.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      {
        name: Vote.name,
        schema: VoteSchema,
        discriminators: [{ name: CommentVote.name, schema: CommentVoteSchema }],
      },
    ]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentVotesService],
})
export class CommentsModule {}
