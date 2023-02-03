import { InjectRedis, RedisModule } from '@liaoliaots/nestjs-redis';
import { AppController } from './app.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CacheModule, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { ScheduleModule } from '@nestjs/schedule';
import {
  AuthGuard,
  AuthModule,
  ConfigModule,
  EventApprovalsModule,
  EventApprovalStepsModule,
  EventsModule,
  FactoryModule,
  FinancesModule,
  MeiliSearchIndexerModule,
  OIDCCacheModule,
  OrgDocumentsModule,
  PoliciesGuard,
  ProjectsModule,
  TeamCategoriesModule,
  TeamsModule,
  TenantsModule,
  UploadModule,
  UsersModule,
} from '@okampus/api/bll';
import { ExceptionsFilter, RestLoggerMiddleware, TraceMiddleware } from '@okampus/api/shards';
import * as Sentry from '@sentry/node';
import { SentryInterceptor, SentryModule } from '@xiifain/nestjs-sentry';
import Redis from 'ioredis';
import { MeiliSearchModule } from 'nestjs-meilisearch';
import { S3Module } from 'nestjs-s3';
import { config } from '../configs/config';
import mikroOrmConfig from '../configs/mikro-orm.config';
import meiliSearchConfig from '../configs/meilisearch.config';
import cacheConfig from '../configs/cache.config';
import redisConfig, { redisConnectionOptions } from '../configs/redis.config';
import storageConfig from '../configs/storage.config';
import { sentryConfig, sentryInterceptorConfig } from '../configs/sentry.config';
import graphqlConfig from '../configs/graphql.config';

// import { CafeteriaModule } from '@api/canteens/canteens.module';
// import { SubjectsModule } from '@api/modules/label/subjects/subjects.module';
// import { TagsModule } from '@api/modules/label/tags/tags.module';
// import { ClassesModule } from '@api/classes/class.module';
// import { ClassMembershipsModule } from '@api/classes/memberships/memberships.module';
// import { SchoolYearsModule } from '@api/classes/school-year/school-years.module';
// import { PoliciesGuard } from '@api/common/modules/authorization';
// import { OIDCStrategyCache } from '@api/common/modules/authorization/oidc-strategy.cache';
// import { CaslModule } from '@api/common/modules/casl/casl.module';
// import { MeiliSearchIndexerModule } from '@api/common/modules/search/meilisearch-indexer.module';
// import { cacheConfig } from '@api/configs/cache.config';
// import { config } from '@api/configs/config';
// import graphqlConfig from '@api/configs/graphql.config';
// import meiliSearchConfig from '@api/configs/meilisearch.config';
// import redisConfig from '@api/configs/redis.config';
// import sentryConfig, { sentryInterceptorConfig } from '@api/configs/sentry.config';
// import storageConfig from '@api/configs/storage.config';
// import { BlogsModule } from '@api/create/blogs/blogs.module';
// import { ContentsModule } from '@api/create/contents/contents.module';
// import { ThreadsModule } from '@api/create/threads/threads.module';
// import { WikisModule } from '@api/create/wikis/wikis.module';
// import { FavoritesModule } from '@api/interact/favorites/favorites.module';
// import { ReactionsModule } from '@api/interact/reactions/reactions.module';
// import { ReportsModule } from '@api/interact/reports/reports.module';
// import { ValidationsModule } from '@api/interact/validations/validations.module';
// import { VotesModule } from '@api/interact/votes/votes.module';
// import { APP_OIDC_CACHE } from '@api/shards/constants';
// import { ExceptionsFilter } from 'libs/api/shards/src/filters/exceptions.filter';
// import { GlobalRequestContext } from '@api/shards/helpers/global-request-context';
// import { RestLoggerMiddleware } from 'libs/api/shards/src/middlewares/rest-logger.middleware';
// import { TraceMiddleware } from 'libs/api/shards/src/middlewares/trace.middleware';
// import { AnnouncementsModule } from '@api/teams/announcements/announcements.module';
// import { InterestsModule } from '@api/teams/interests/interests.module';
// import { MetricsModule } from '@api/teams/metrics/metrics.module';
// import { SocialsModule } from '@api/teams/socials/socials.module';
// import { TeamsModule } from '@api/teams/teams.module';
// import { TenantsCoreModule } from '@api/tenants/core-tenants.module';
// import { TenantsModule } from '@api/tenants/tenants.module';
// import { AuthGuard } from '@api/uaa/auth/auth.guard';
// import { AuthModule } from '@api/uaa/auth/auth.module';
// import { BadgesModule } from '@api/uaa/badges/badges.module';
// import { SettingsModule } from '@api/uaa/settings/settings.module';
// import { StatisticsModule } from '@api/uaa/statistics/statistics.module';
// import { UsersModule } from '@api/uaa/users/users.module';
// import { FilesModule } from '@api/upload/files.module';
// import { AppController } from './app.controller';
// import { HealthModule } from './health/health.module';
// import mikroOrmConfig from './common/configs/mikro-orm.config';
// import { SubscribersModule } from './common/modules/subscribers/subscribers.module';

@Module({
  imports: [
    // Configs
    // CaslModule,
    ConfigModule.forRoot(config, redisConnectionOptions),
    GraphQLModule.forRoot<MercuriusDriverConfig>(graphqlConfig),
    // TODO: Replace with .forRoot when https://github.com/lambrohan/nestjs-meilisearch/pull/5 is merged & published
    MeiliSearchModule.forRootAsync(meiliSearchConfig),
    MikroOrmModule.forRoot(mikroOrmConfig),
    S3Module.forRoot(storageConfig),
    ScheduleModule.forRoot(),
    SentryModule.forRoot(sentryConfig),

    // Cache
    CacheModule.registerAsync(cacheConfig),
    OIDCCacheModule,
    RedisModule.forRoot(redisConfig),

    // MeiliSearch
    MeiliSearchIndexerModule,

    // Upload
    UploadModule,
    // Global request context
    // RequestContextModule.forRoot({
    //   contextClass: GlobalRequestContext,
    //   isGlobal: true,
    // }),

    // // Subscribers module
    // SubscribersModule,

    // // Custom modules
    // AnnouncementsModule,
    AuthModule,
    FactoryModule,
    // BadgesModule,
    // BlogsModule,
    // CafeteriaModule,
    // ClassesModule,
    // ClassMembershipsModule,
    // ContentsModule,
    // FavoritesModule,
    // FilesModule,
    // HealthModule,
    // InterestsModule,
    // MetricsModule,
    // ReactionsModule,
    // ReportsModule,
    // SchoolYearsModule,
    // SettingsModule,
    // SocialsModule,
    // StatisticsModule,
    // SubjectsModule,
    // TagsModule,
    // TeamsModule,
    // TenantsCoreModule,
    TenantsModule,
    // ThreadsModule,
    UsersModule,
    EventsModule,
    TeamsModule,
    EventApprovalsModule,
    EventApprovalStepsModule,
    FinancesModule,
    ProjectsModule,
    TeamCategoriesModule,
    OrgDocumentsModule,
    // ValidationsModule,
    // VotesModule,
    // WikisModule,
  ],
  providers: [
    // { provide: APP_OIDC_CACHE, useValue: new OIDCStrategyCache() },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PoliciesGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (): SentryInterceptor => new SentryInterceptor(sentryInterceptorConfig),
    },
  ],
  controllers: [AppController],
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
