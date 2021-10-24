import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Comment, CommentSchema } from './comment.schema';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
