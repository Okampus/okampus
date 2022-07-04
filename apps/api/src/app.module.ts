import { InjectRedis, RedisModule } from '@liaoliaots/nestjs-redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { MiddlewareConsumer } from '@nestjs/common';
import { Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import * as Sentry from '@sentry/node';
import RedisStore from 'connect-redis';
import session from 'express-session';
import Redis from 'ioredis';
import { S3Module } from 'nestjs-s3';
import passport from 'passport';
import { AnnouncementsModule } from './announcements/announcements.module';
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
import { MetricsModule } from './metrics/metrics.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ReportsModule } from './reports/reports.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { config } from './shared/configs/config';
import redisConfig from './shared/configs/redis.config';
import sentryConfig, { sentryInterceptorConfig } from './shared/configs/sentry.config';
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
    // Configs
    CaslModule,
    EventEmitterModule.forRoot(),
    MikroOrmModule.forRoot(),
    RedisModule.forRoot(redisConfig),
    S3Module.forRoot(storageConfig),
    ScheduleModule.forRoot(),
    SentryModule.forRoot(sentryConfig),

    // Custom modules
    AnnouncementsModule,
    AuthModule,
    BadgesModule,
    BlogsModule,
    ContactsModule,
    ContentsModule,
    FavoritesModule,
    FilesModule,
    HealthModule,
    MetricsModule,
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
    { provide: APP_INTERCEPTOR, useFactory: (): SentryInterceptor => new SentryInterceptor(sentryInterceptorConfig) },
  ],
  controllers: [AppController],
  exports: [],
})
export class AppModule {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public configure(consumer: MiddlewareConsumer): void {
    // Setup sentry
    if (config.get('sentry.enabled')) {
      consumer.apply(
        Sentry.Handlers.requestHandler(),
        TraceMiddleware,
      ).forRoutes({ path: '*', method: RequestMethod.ALL });
    }

    // Setup redis for SSO sessions
    consumer
      .apply(
        session({
          store: new (RedisStore(session))({ client: this.redis, logErrors: true }),
          saveUninitialized: false,
          secret: config.get('session.secret'),
          resave: false,
        }),
        passport.initialize(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        passport.session(),
      )
      .forRoutes('*');
  }
}
