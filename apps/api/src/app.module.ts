import { AppController } from './app.controller';
import { config } from '../configs/config';

import graphqlConfig from '../configs/graphql.config';
import mikroOrmConfig from '../configs/mikro-orm.config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  AuthGuard,
  AuthModule,
  DatabaseSeeder,
  OIDCCacheModule,
  UploadsModule,
  HealthModule,
  MeiliSearchModule,
  PubSubModule,
  RedisModule,
  SentryInterceptor,
  SentryModule,
  TraceMiddleware,
  RestLoggerMiddleware,
  TeamsModule,
  UploadsService,
  EventsModule,
  loadConfig,
  TagsModule,
  TeamFinancesModule,
  ProjectsModule,
  IndividualsModule,
  UserInfosModule,
  EventJoinsModule,
  EventAttendancesModule,
  FormsModule,
  ActionsModule,
  TeamJoinsModule,
  EventApprovalStepsModule,
  TenantsModule,
  NotificationsModule,
  NotificationsService,
  FollowsModule,
  GeocodeModule,
  TextractModule,
  NationalIdentificationModule,
  ActorImagesModule,
  ActorsModule,
} from '@okampus/api/bll';
import { Individual, Team, Tenant } from '@okampus/api/dal';
import { ExceptionsFilter } from '@okampus/api/shards';

import {
  ADMIN_ACCOUNT_EMAIL,
  ADMIN_ACCOUNT_FIRST_NAME,
  ADMIN_ACCOUNT_LAST_NAME,
  ADMIN_ACCOUNT_SLUG,
  ADMIN_DEPARTMENT_SLUG,
  ANON_ACCOUNT_EMAIL,
  ANON_ACCOUNT_FIRST_NAME,
  ANON_ACCOUNT_LAST_NAME,
  ANON_ACCOUNT_SLUG,
  BASE_TENANT,
} from '@okampus/shared/consts';
import { ScopeRole, TeamType } from '@okampus/shared/enums';
import { capitalize } from '@okampus/shared/utils';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigModule, ConfigService } from '@nestjs/config';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import Sentry from '@sentry/node';
import { redisStore } from 'cache-manager-redis-yet';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { hash } from 'argon2';

import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import type { MiddlewareConsumer, NestModule, OnModuleInit } from '@nestjs/common';

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
    ConfigModule.forRoot({ ignoreEnvFile: true, load: [() => config] }),
    GraphQLModule.forRoot<MercuriusDriverConfig>(graphqlConfig),
    // GraphQLModule.forRoot({
    //   typePaths: ["./schema.graphql","./schema2.graphql"],
    //   include: [OtherModule,HelloModule],
    // }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    ScheduleModule.forRoot(),

    SentryModule,
    RedisModule,
    MeiliSearchModule,

    // Cache
    ...(config.redis.isEnabled
      ? [
          PubSubModule.forRoot({ host: config.redis.host, port: config.redis.port, password: config.redis.password }),
          // CacheModule.register({
          //   store: redisStore,
          //   host: config.redis.host,
          //   port: config.redis.port,
          //   pas
          // })
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
          }),
        ]
      : [
          // TODO: add fallback pubsub if redis is disabled
          CacheModule.register(),
        ]),

    OIDCCacheModule,
    NotificationsModule,
    GeocodeModule,
    NationalIdentificationModule,
    TextractModule,
    AuthModule,
    UploadsModule,

    // // Subscribers module
    // SubscribersModule,

    // // Custom modules
    // AnnouncementsModule,
    IndividualsModule,
    UserInfosModule,
    // BadgesModule,
    // BlogsModule,
    // CafeteriaModule,
    // ClassesModule,
    // ClassMembershipsModule,
    // ContentsModule,
    // FavoritesModule,
    // FilesModule,
    HealthModule,
    EventsModule,
    EventAttendancesModule,
    EventApprovalStepsModule,
    TenantsModule,
    ActorsModule,
    ActorImagesModule,
    EventJoinsModule,
    EventsModule,
    FormsModule,
    ProjectsModule,
    TagsModule,
    TeamFinancesModule,
    TeamJoinsModule,
    TeamsModule,
    ActionsModule,
    FollowsModule,
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
    // ValidationsModule,
    // VotesModule,
    // WikisModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    // { provide: APP_GUARD, useClass: PolicyGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: SentryInterceptor },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly uploadsService: UploadsService,
    private readonly notificationsService: NotificationsService,
    private readonly orm: MikroORM,
    private readonly em: EntityManager
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    // Setup sentry
    if (config.sentry.isEnabled) consumer.apply(Sentry.Handlers.requestHandler(), TraceMiddleware).forRoutes('*');

    // Setup loggers
    consumer.apply(RestLoggerMiddleware).exclude('/graphql').forRoutes('*');
  }

  public async onModuleInit() {
    const secret = Buffer.from(loadConfig<string>(this.configService, 'pepperSecret'));
    const adminAccountPassword = loadConfig<string>(this.configService, 'baseTenant.adminPassword');

    const isSeeding = loadConfig<boolean>(this.configService, 'database.isSeeding');

    let admin: Individual;
    const tenant = await this.em.findOne(Tenant, { domain: BASE_TENANT });
    if (tenant) {
      admin = await this.em.findOneOrFail(Individual, { actor: { slug: ADMIN_ACCOUNT_SLUG } });
    } else {
      // Init base tenant
      const tenant = new Tenant({ name: capitalize(BASE_TENANT), domain: BASE_TENANT, pointName: 'LXP' });

      const administrationTeam = new Team({
        name: "Équipe d'administration",
        slug: ADMIN_DEPARTMENT_SLUG(tenant.domain),
        type: TeamType.Tenant,
        createdBy: null,
        tenant,
      });

      tenant.team = administrationTeam;

      const anon = new Individual({
        slug: ANON_ACCOUNT_SLUG,
        name: `${ANON_ACCOUNT_FIRST_NAME} ${ANON_ACCOUNT_LAST_NAME}`,
        userInfo: { firstName: ANON_ACCOUNT_FIRST_NAME, lastName: ANON_ACCOUNT_LAST_NAME },
        email: ANON_ACCOUNT_EMAIL,
        scopeRole: ScopeRole.Admin,
        createdBy: null,
        tenant,
      });

      admin = new Individual({
        slug: ADMIN_ACCOUNT_SLUG,
        name: `${ADMIN_ACCOUNT_FIRST_NAME} ${ADMIN_ACCOUNT_LAST_NAME}`,
        userInfo: { firstName: ADMIN_ACCOUNT_FIRST_NAME, lastName: ADMIN_ACCOUNT_LAST_NAME },
        scopeRole: ScopeRole.Admin,
        email: ADMIN_ACCOUNT_EMAIL,
        createdBy: null,
        tenant,
      });
      admin.passwordHash = await hash(adminAccountPassword, { secret: secret });
      await this.em.persistAndFlush([tenant, admin, anon]); // Tenant cascade persisted

      const novu = this.notificationsService.novu;
      if (novu) {
        let subscribers;
        do {
          console.log('Deleting previous seeded subscribers...');
          try {
            subscribers = await novu.subscribers.list(0);
          } catch {
            throw new Error('Novu request failed! Be sure to have a valid API key and to have Internet access.');
          }

          const subscribersResult = subscribers.data;
          if (!('data' in subscribersResult))
            throw new Error('Novu request failed! Be sure to have a valid API key and to have Internet access.');

          // Delete all subscribers
          if (subscribersResult.data.length === 0) break;

          const deletePromise = async ({ subscriberId: id }: { subscriberId: string }) =>
            await novu.subscribers.delete(id);
          await Promise.all(subscribersResult.data.map(deletePromise));
        } while (subscribers.data.length > 0);

        const admin = await this.em.findOneOrFail(Individual, { actor: { slug: ADMIN_ACCOUNT_SLUG } });
        console.log(`Adding admin (${admin.id}) subscriber to Novu...)`);
        await novu.subscribers.identify(admin.id, {
          email: ADMIN_ACCOUNT_EMAIL,
          firstName: ADMIN_ACCOUNT_FIRST_NAME,
          lastName: ADMIN_ACCOUNT_LAST_NAME,
          locale: 'fr',
        });
      } else {
        console.log('Novu is not configured, skipping subscribers seeding...');
      }
    }

    // Seed base tenant

    // eslint-disable-next-line unicorn/no-array-method-this-argument
    const anyTeam = await this.em.find(Team, { tenant: { domain: BASE_TENANT } });
    if (anyTeam.length === 1 && isSeeding) {
      DatabaseSeeder.pepper = secret;
      DatabaseSeeder.targetTenant = BASE_TENANT;
      DatabaseSeeder.upload = this.uploadsService;
      DatabaseSeeder.admin = admin;

      const seeder = this.orm.getSeeder();
      await seeder.seed(DatabaseSeeder);
    }
  }
}
