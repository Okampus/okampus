import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { S3Module } from 'nestjs-s3';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { BadgesModule } from './badges/badges.module';
import { BlogsModule } from './blogs/blogs.module';
import { ClubsModule } from './clubs/clubs.module';
import { ContactsModule } from './contacts/contacts.module';
import { ContentsModule } from './contents/contents.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FilesModule } from './files/files.module';
import { HealthModule } from './health/health.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ReportsModule } from './reports/reports.module';
import storageConfig from './shared/configs/storage.config';
import { PoliciesGuard } from './shared/modules/authorization';
import { CaslModule } from './shared/modules/casl/casl.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TagsModule } from './tags/tags.module';
import { TeamsModule } from './teams/teams.module';
import { ThreadsModule } from './threads/threads.module';
import { UsersModule } from './users/users.module';
import { VotesModule } from './votes/votes.module';
import { WikisModule } from './wiki/wikis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    MikroOrmModule.forRoot(),
    S3Module.forRoot({ config: storageConfig }),
    CaslModule,
    AuthModule,
    BadgesModule,
    BlogsModule,
    ClubsModule,
    ContentsModule,
    FavoritesModule,
    FilesModule,
    HealthModule,
    ReactionsModule,
    ReportsModule,
    ContactsModule,
    StatisticsModule,
    SubjectsModule,
    TagsModule,
    TeamsModule,
    ThreadsModule,
    UsersModule,
    VotesModule,
    WikisModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PoliciesGuard },
  ],
  controllers: [AppController],
  exports: [],
})
export class AppModule {}
