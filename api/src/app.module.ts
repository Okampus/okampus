import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { S3Module } from 'nestjs-s3';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { BadgesModule } from './badges/badges.module';
import { BlogsModule } from './blogs/blogs.module';
import { ContactsModule } from './contacts/contacts.module';
import { ContentsModule } from './contents/contents.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FilesModule } from './files/files.module';
import { HealthModule } from './health/health.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ReportsModule } from './reports/reports.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { config } from './shared/configs/config';
import sentryConfig from './shared/configs/sentry.config';
import storageConfig from './shared/configs/storage.config';
import { ExceptionsFilter } from './shared/lib/filters/exceptions.filter';
import { TypesenseFilter } from './shared/lib/filters/typesense.filter';
import { TraceMiddleware } from './shared/lib/middlewares/trace.middleware';
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
    EventEmitterModule.forRoot(),
    MikroOrmModule.forRoot(),
    S3Module.forRoot(storageConfig),
    SentryModule.forRoot(sentryConfig),
    CaslModule,
    AuthModule,
    BadgesModule,
    BlogsModule,
    ContactsModule,
    ContentsModule,
    FavoritesModule,
    FilesModule,
    HealthModule,
    ReactionsModule,
    ReportsModule,
    RestaurantModule,
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
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_FILTER, useClass: TypesenseFilter },
  ],
  controllers: [AppController],
  exports: [],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    if (config.get('sentry.enabled'))
      consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
