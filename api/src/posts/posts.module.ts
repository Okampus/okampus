import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import type { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/users.module';
import { PostLikesService } from './post-likes.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostLikes, PostLikesSchema } from './schemas/post-likes.schema';
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
        name: PostLikes.name,
        schema: PostLikesSchema,
      },
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostLikesService],
  exports: [PostsService],
})
export class PostsModule {}
