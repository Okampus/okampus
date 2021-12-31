import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { FilesModule } from './files/files.module';
import { PostsModule } from './posts/posts.module';
import { RepliesModule } from './replies/replies.module';
import { CaslModule } from './shared/modules/casl/casl.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(),
    AuthModule,
    CaslModule,
    CommentsModule,
    FilesModule,
    PostsModule,
    RepliesModule,
    SubjectsModule,
    TagsModule,
    UsersModule,
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AppModule {}
