import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { BadgesModule } from './badges/badges.module';
import { ClubsModule } from './clubs/clubs.module';
import { CommentsModule } from './comments/comments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FilesModule } from './files/files.module';
import { HealthModule } from './health/health.module';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './reactions/reactions.module';
import { RepliesModule } from './replies/replies.module';
import { PoliciesGuard } from './shared/modules/authorization';
import { CaslModule } from './shared/modules/casl/casl.module';
import { SocialsModule } from './socials/socials.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(),
    ArticlesModule,
    AuthModule,
    BadgesModule,
    CaslModule,
    ClubsModule,
    CommentsModule,
    FavoritesModule,
    FilesModule,
    HealthModule,
    PostsModule,
    ReactionsModule,
    RepliesModule,
    SubjectsModule,
    TagsModule,
    UsersModule,
    SocialsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PoliciesGuard },
  ],
  controllers: [AppController],
  exports: [],
})
export class AppModule {}
