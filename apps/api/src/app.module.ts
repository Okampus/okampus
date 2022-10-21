import { InjectRedis, RedisModule } from '@liaoliaots/nestjs-redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CacheModule, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { ScheduleModule } from '@nestjs/schedule';
import * as Sentry from '@sentry/node';
import { SentryInterceptor, SentryModule } from '@xiifain/nestjs-sentry';
import Redis from 'ioredis';
import { MeiliSearchModule } from 'nestjs-meilisearch';
import { S3Module } from 'nestjs-s3';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AppController } from './app.controller';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { BadgesModule } from './badges/badges.module';
import { BlogsModule } from './blogs/blogs.module';
import { ContentsModule } from './contents/contents.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FilesModule } from './files/files.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ReportsModule } from './reports/reports.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { SchoolGroupMembershipsModule } from './school-group/memberships/memberships.module';
import { SchoolGroupsModule } from './school-group/school-groups.module';
import { SchoolYearsModule } from './school-group/school-year/school-years.module';
import { SettingsModule } from './settings/settings.module';

import cacheConfig from './shared/configs/cache.config';
import { config } from './shared/configs/config';
import graphqlConfig from './shared/configs/graphql.config';
import meiliSearchConfig from './shared/configs/meilisearch.config';
import redisConfig from './shared/configs/redis.config';
import sentryConfig, { sentryInterceptorConfig } from './shared/configs/sentry.config';
import storageConfig from './shared/configs/storage.config';
import { APP_OIDC_CACHE } from './shared/lib/constants';

import { ExceptionsFilter } from './shared/lib/filters/exceptions.filter';
import { RestLoggerMiddleware } from './shared/lib/middlewares/rest-logger.middleware';
import { TraceMiddleware } from './shared/lib/middlewares/trace.middleware';
import { PoliciesGuard } from './shared/modules/authorization';
import { OIDCStrategyCache } from './shared/modules/authorization/oidc-strategy.cache';
import { CaslModule } from './shared/modules/casl/casl.module';
import { MeiliSearchIndexerModule } from './shared/modules/search/meilisearch-indexer.module';
import { SocialsModule } from './socials/socials.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TagsModule } from './tags/tags.module';
import { InterestsModule } from './teams/interests/interests.module';
import { TeamsModule } from './teams/teams.module';
import { TenantsModule } from './tenants/tenants.module';
import { TenantsCoreModule } from './tenants/tenants/tenants.module';
import { ThreadsModule } from './threads/threads.module';
import { UsersModule } from './users/users.module';
import { ValidationsModule } from './validations/validations.module';
import { VotesModule } from './votes/votes.module';
import { WikisModule } from './wiki/wikis.module';

@Module({
  imports: [
    // Configs
    CacheModule.register(cacheConfig),
    CaslModule,
    EventEmitterModule.forRoot(),
    GraphQLModule.forRoot<MercuriusDriverConfig>(graphqlConfig),
    // TODO: Replace with .forRoot when https://github.com/lambrohan/nestjs-meilisearch/pull/5 is merged & published
    MeiliSearchModule.forRootAsync(meiliSearchConfig),
    MeiliSearchIndexerModule,
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
    ContentsModule,
    FavoritesModule,
    FilesModule,
    HealthModule,
    InterestsModule,
    MetricsModule,
    ReactionsModule,
    ReportsModule,
    RestaurantModule,
    SettingsModule,
    SocialsModule,
    StatisticsModule,
    SubjectsModule,
    TagsModule,
    TeamsModule,
    TenantsCoreModule,
    TenantsModule,
    SchoolGroupsModule,
    SchoolGroupMembershipsModule,
    SchoolYearsModule,
    ThreadsModule,
    UsersModule,
    VotesModule,
    WikisModule,
    ValidationsModule,
  ],
  providers: [
    { provide: APP_OIDC_CACHE, useValue: new OIDCStrategyCache() },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PoliciesGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_INTERCEPTOR, useFactory: (): SentryInterceptor => new SentryInterceptor(sentryInterceptorConfig) },
  ],
  controllers: [AppController],
  exports: [],
})
export class AppModule implements NestModule {
  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    // Setup sentry
    if (config.sentry.enabled) {
      consumer.apply(
        Sentry.Handlers.requestHandler(),
        TraceMiddleware,
      ).forRoutes({ path: '*', method: RequestMethod.ALL });
    }

    // Setup loggers
    consumer
      .apply(RestLoggerMiddleware)
      .exclude('/graphql')
      .forRoutes('*');
  }
}
