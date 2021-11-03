import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Post } from '../posts/entities/post.entity';
import { CommentVotesService } from './comment-votes.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentVote } from './entities/comment-vote.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post, Comment, CommentVote]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentVotesService],
  exports: [CommentsService],
})
export class CommentsModule {}
