import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { config } from './config';
import { FilesModule } from './files/files.module';
import { PostsModule } from './posts/posts.module';
import { RepliesModule } from './replies/replies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(config.get('mongoUri')),
    PostsModule,
    CommentsModule,
    RepliesModule,
    FilesModule,
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AppModule {}
