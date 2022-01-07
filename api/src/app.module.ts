import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CommentsModule } from './comments/comments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AttachmentsModule } from './files/attachments/attachments.module';
import { FileUploadsModule } from './files/file-uploads/file-uploads.module';
import { InfoDocsModule } from './files/info-docs/info-docs.module';
import { ProfileImagesModule } from './files/profile-images/profile-images.module';
import { StudyDocsModule } from './files/study-docs/study-docs.module';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './reactions/reactions.module';
import { RepliesModule } from './replies/replies.module';
import { CaslModule } from './shared/modules/casl/casl.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

// TODO: Group file modules into a single module, using RouterModule
@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(),
    ArticlesModule,
    AttachmentsModule,
    AuthModule,
    CaslModule,
    CommentsModule,
    FavoritesModule,
    FileUploadsModule,
    InfoDocsModule,
    PostsModule,
    ProfileImagesModule,
    ReactionsModule,
    RepliesModule,
    StudyDocsModule,
    SubjectsModule,
    TagsModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [],
  exports: [],
})
export class AppModule {}
