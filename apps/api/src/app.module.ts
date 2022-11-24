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

import cacheConfig from '@common/configs/cache.config';
import { config } from '@common/configs/config';
import graphqlConfig from '@common/configs/graphql.config';
import meiliSearchConfig from '@common/configs/meilisearch.config';
import redisConfig from '@common/configs/redis.config';
import sentryConfig, {
  sentryInterceptorConfig,
} from '@common/configs/sentry.config';
import storageConfig from '@common/configs/storage.config';
import { APP_OIDC_CACHE } from '@common/lib/constants';

import { ExceptionsFilter } from '@common/lib/filters/exceptions.filter';
import { RestLoggerMiddleware } from '@common/lib/middlewares/rest-logger.middleware';
import { TraceMiddleware } from '@common/lib/middlewares/trace.middleware';
import { PoliciesGuard } from '@common/modules/authorization';
import { OIDCStrategyCache } from '@common/modules/authorization/oidc-strategy.cache';
import { CaslModule } from '@common/modules/casl/casl.module';
import { MeiliSearchIndexerModule } from '@common/modules/search/meilisearch-indexer.module';
import { SubjectsModule } from '@modules/catalog/subjects/subjects.module';
import { TagsModule } from '@modules/catalog/tags/tags.module';
import { BlogsModule } from '@modules/create/blogs/blogs.module';
import { ContentsModule } from '@modules/create/contents/contents.module';
import { ThreadsModule } from '@modules/create/threads/threads.module';
import { WikisModule } from '@modules/create/wikis/wikis.module';
import { FavoritesModule } from '@modules/interact/favorites/favorites.module';
import { ReactionsModule } from '@modules/interact/reactions/reactions.module';
import { ReportsModule } from '@modules/interact/reports/reports.module';
import { ValidationsModule } from '@modules/interact/validations/validations.module';
import { VotesModule } from '@modules/interact/votes/votes.module';
import { CafeteriaModule } from '@modules/org/canteens/canteens.module';
import { ClassesModule } from '@modules/org/classes/class.module';
import { ClassMembershipsModule } from '@modules/org/classes/memberships/memberships.module';
import { SchoolYearsModule } from '@modules/org/classes/school-year/school-years.module';
import { AnnouncementsModule } from '@modules/org/teams/announcements/announcements.module';
import { InterestsModule } from '@modules/org/teams/interests/interests.module';
import { MetricsModule } from '@modules/org/teams/metrics/metrics.module';
import { SocialsModule } from '@modules/org/teams/socials/socials.module';
import { TeamsModule } from '@modules/org/teams/teams.module';
import { TenantsCoreModule } from '@modules/org/tenants/core-tenants.module';
import { TenantsModule } from '@modules/org/tenants/tenants.module';
import { FilesModule } from '@modules/store/files.module';
import { AuthGuard } from '@modules/uua/auth/auth.guard';
import { AuthModule } from '@modules/uua/auth/auth.module';
import { BadgesModule } from '@modules/uua/badges/badges.module';
import { SettingsModule } from '@modules/uua/settings/settings.module';
import { StatisticsModule } from '@modules/uua/statistics/statistics.module';
import { UsersModule } from '@modules/uua/users/users.module';
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
    CafeteriaModule,
    SettingsModule,
    SocialsModule,
    StatisticsModule,
    SubjectsModule,
    TagsModule,
    TeamsModule,
    TenantsCoreModule,
    TenantsModule,
    ClassesModule,
    ClassMembershipsModule,
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
    {
      provide: APP_INTERCEPTOR,
      useFactory: (): SentryInterceptor =>
        new SentryInterceptor(sentryInterceptorConfig),
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
