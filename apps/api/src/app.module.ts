import { AppController } from './app.controller';
import { config } from '../configs/config';
import graphqlConfig from '../configs/graphql.config';
import mikroOrmConfig from '../configs/mikro-orm.config';
import meiliSearchConfig from '../configs/meilisearch.config';
import { redisOptions } from '../configs/redis.config';

import { sentryConfig } from '../configs/sentry.config';
import {
  HealthModule,
  MeiliSearchModule,
  MinioModule,
  PubSubModule,
  RedisModule,
  RestLoggerMiddleware,
  SentryInterceptor,
  SentryModule,
  TraceMiddleware,
} from '@okampus/api/bll';
import { ExceptionsFilter } from '@okampus/api/shards';
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
  PolicyGuard,
  ProjectsModule,
  TeamCategoriesModule,
  TeamsModule,
  TenantsModule,
  UploadModule,
  UsersModule,
} from '@okampus/api/bll';

import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule, Module, RequestMethod } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import Sentry from '@sentry/node';
import { redisStore } from 'cache-manager-redis-store';

import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import type { MiddlewareConsumer, NestModule, CacheModuleAsyncOptions } from '@nestjs/common';

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
// import mikroOrmConfig from './common/configs/mikro-orm.config';
// import { SubscribersModule } from './common/modules/subscribers/subscribers.module';

@Module({
  imports: [
    // Configs
    // CaslModule,
    ConfigModule.forRoot(config),
    GraphQLModule.forRoot<MercuriusDriverConfig>(graphqlConfig),
    MeiliSearchModule.forRoot(meiliSearchConfig),
    PubSubModule.forRoot({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    }),
    MinioModule.forRoot({
      endPoint: config.s3.endpoint,
      accessKey: config.s3.accessKeyId,
      secretKey: config.s3.secretAccessKey,
      region: config.s3.region,
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    SentryModule.forRoot(sentryConfig),
    ScheduleModule.forRoot(),

    // Cache
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          // Store-specific configuration:
          socket: {
            host: config.redis.host,
            port: config.redis.port,
          },
          password: config.redis.password,
        }),
      }),
      isGlobal: true,
    } as CacheModuleAsyncOptions),

    RedisModule.forRoot(redisOptions),
    OIDCCacheModule,

    // MeiliSearch
    MeiliSearchIndexerModule,

    // Upload
    UploadModule,

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
    HealthModule,
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
    { provide: APP_GUARD, useClass: PolicyGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: SentryInterceptor },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
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
