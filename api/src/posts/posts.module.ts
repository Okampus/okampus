import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import type { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import { AuthModule } from '../auth/auth.module';
import { Vote, VoteSchema } from '../shared/schemas/vote.schema';
import { UserModule } from '../users/users.module';
import { PostVotesService } from './post-votes.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostVote, PostVoteSchema } from './schemas/post-vote.schema';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: (): Schema => {
          const schema = PostSchema;
          schema.plugin(autoIncrement, { model: 'Post', startAt: 1 });
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Vote.name,
        schema: VoteSchema,
        discriminators: [
          { name: PostVote.name, schema: PostVoteSchema },
        ],
      },
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostVotesService],
  exports: [PostsService],
})
export class PostsModule {}
