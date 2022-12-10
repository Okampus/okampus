import { InjectRedis, RedisModule } from '@liaoliaots/nestjs-redis';
import { RequestContextModule } from '@medibloc/nestjs-request-context';
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

import { CafeteriaModule } from '@canteens/canteens.module';
import { SubjectsModule } from '@catalog/subjects/subjects.module';
import { TagsModule } from '@catalog/tags/tags.module';
import { ClassesModule } from '@classes/class.module';
import { ClassMembershipsModule } from '@classes/memberships/memberships.module';
import { SchoolYearsModule } from '@classes/school-year/school-years.module';
import { PoliciesGuard } from '@common/modules/authorization';
import { OIDCStrategyCache } from '@common/modules/authorization/oidc-strategy.cache';
import { CaslModule } from '@common/modules/casl/casl.module';
import { MeiliSearchIndexerModule } from '@common/modules/search/meilisearch-indexer.module';
import cacheConfig from '@configs/cache.config';
import { config } from '@configs/config';
import graphqlConfig from '@configs/graphql.config';
import meiliSearchConfig from '@configs/meilisearch.config';
import redisConfig from '@configs/redis.config';
import sentryConfig, { sentryInterceptorConfig } from '@configs/sentry.config';
import storageConfig from '@configs/storage.config';
import { BlogsModule } from '@create/blogs/blogs.module';
import { ContentsModule } from '@create/contents/contents.module';
import { ThreadsModule } from '@create/threads/threads.module';
import { WikisModule } from '@create/wikis/wikis.module';
import { FavoritesModule } from '@interact/favorites/favorites.module';
import { ReactionsModule } from '@interact/reactions/reactions.module';
import { ReportsModule } from '@interact/reports/reports.module';
import { ValidationsModule } from '@interact/validations/validations.module';
import { VotesModule } from '@interact/votes/votes.module';
import { APP_OIDC_CACHE } from '@lib/constants';
import { ExceptionsFilter } from '@lib/filters/exceptions.filter';
import { GlobalRequestContext } from '@lib/helpers/global-request-context';
import { RestLoggerMiddleware } from '@lib/middlewares/rest-logger.middleware';
import { TraceMiddleware } from '@lib/middlewares/trace.middleware';
import { AnnouncementsModule } from '@teams/announcements/announcements.module';
import { InterestsModule } from '@teams/interests/interests.module';
import { MetricsModule } from '@teams/metrics/metrics.module';
import { SocialsModule } from '@teams/socials/socials.module';
import { TeamsModule } from '@teams/teams.module';
import { TenantsCoreModule } from '@tenants/core-tenants.module';
import { TenantsModule } from '@tenants/tenants.module';
import { AuthGuard } from '@uaa/auth/auth.guard';
import { AuthModule } from '@uaa/auth/auth.module';
import { BadgesModule } from '@uaa/badges/badges.module';
import { SettingsModule } from '@uaa/settings/settings.module';
import { StatisticsModule } from '@uaa/statistics/statistics.module';
import { UsersModule } from '@uaa/users/users.module';
import { FilesModule } from '@upload/files.module';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';

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

    // Global request context
    RequestContextModule.forRoot({ contextClass: GlobalRequestContext, isGlobal: true }),

    // Custom modules
    AnnouncementsModule,
    AuthModule,
    BadgesModule,
    BlogsModule,
    CafeteriaModule,
    ClassesModule,
    ClassMembershipsModule,
    ContentsModule,
    FavoritesModule,
    FilesModule,
    HealthModule,
    InterestsModule,
    MetricsModule,
    ReactionsModule,
    ReportsModule,
    SchoolYearsModule,
    SettingsModule,
    SocialsModule,
    StatisticsModule,
    SubjectsModule,
    TagsModule,
    TeamsModule,
    TenantsCoreModule,
    TenantsModule,
    ThreadsModule,
    UsersModule,
    ValidationsModule,
    VotesModule,
    WikisModule,
  ],
  providers: [
    { provide: APP_OIDC_CACHE, useValue: new OIDCStrategyCache() },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PoliciesGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (): SentryInterceptor => new SentryInterceptor(sentryInterceptorConfig),
    },
  ],
  controllers: [AppController],
  exports: [APP_OIDC_CACHE],
})
export class AppModule implements NestModule {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public configure(consumer: MiddlewareConsumer): void {
    // Setup sentry
    if (config.sentry.enabled) {
      consumer
        .apply(Sentry.Handlers.requestHandler(), TraceMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.ALL });
    }

    // Setup loggers
    consumer.apply(RestLoggerMiddleware).exclude('/graphql').forRoutes('*');
  }
}
