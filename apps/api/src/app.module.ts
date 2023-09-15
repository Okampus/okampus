import { AppController } from './app.controller';
import { DatabaseSeeder } from './seeders/app.seeder';
import { config } from './config';

import graphqlConfig from './configs/graphql.config';
import mikroOrmConfig from './configs/mikro-orm.config';

import {
  AuthGuard,
  AuthModule,
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
  EventsModule,
  TagsModule,
  TransactionsModule,
  ProjectsModule,
  UsersModule,
  LegalUnitsModule,
  LegalUnitLocationsModule,
  EventJoinsModule,
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
  SocialsModule,
  GoogleModule,
  BankAccountsModule,
  EventApprovalsModule,
  BankInfosModule,
  AddressesModule,
  TeamMembersModule,
  TeamMemberRolesModule,
  UploadsService,
  GeocodeService,
  ActorTagsModule,
  EventFavoritesModule,
  EventOrganizesModule,
  EventSupervisorsModule,
  ExpensesModule,
  ExpenseItemsModule,
  GrantsModule,
  GrantAllocatesModule,
  MissionsModule,
  MissionJoinsModule,
  TeamDocumentsModule,
  TeamHistoriesModule,
  TeamRolesModule,
  CampusesModule,
  CampusClustersModule,
  EventApprovalValidatorsModule,
  TenantMembersModule,
  TenantMemberRolesModule,
  TenantRolesModule,
  FormSubmissionsModule,
  LocationsModule,
  RequiredDocumentsModule,
  RequiredRolesModule,
  TeamRequiredRolesModule,
} from '@okampus/api/bll';
import { AdminRole, Form, User, Team, Tenant, TenantRole, TenantMember, TenantMemberRole } from '@okampus/api/dal';
import { ExceptionsFilter } from '@okampus/api/shards';

import {
  ADMIN_ACCOUNT_EMAIL,
  ADMIN_ACCOUNT_FIRST_NAME,
  ADMIN_ACCOUNT_LAST_NAME,
  ADMIN_ACCOUNT_SLUG,
  ANON_ACCOUNT_EMAIL,
  ANON_ACCOUNT_FIRST_NAME,
  ANON_ACCOUNT_LAST_NAME,
  ANON_ACCOUNT_SLUG,
} from '@okampus/shared/consts';

import { Colors, ControlType, FormType, TenantRoleType } from '@okampus/shared/enums';

import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import Sentry from '@sentry/node';
import { redisStore } from 'cache-manager-redis-yet';

import { EntityManager, MikroORM } from '@mikro-orm/core';
import { hash } from 'argon2';

import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import type { MiddlewareConsumer, NestModule, OnModuleInit } from '@nestjs/common';

const redisFactory = async () => ({
  store: await redisStore({
    socket: { host: config.redis.host, port: config.redis.port },
    password: config.redis.password,
  }),
});

const redisConfig = { host: config.redis.host, port: config.redis.port, password: config.redis.password };

@Module({
  imports: [
    // Configs
    ConfigModule.forRoot({ ignoreEnvFile: true, load: [() => config] }),
    GraphQLModule.forRoot<MercuriusDriverConfig>(graphqlConfig),
    MikroOrmModule.forRoot(mikroOrmConfig),
    ScheduleModule.forRoot(),

    // Cache
    RedisModule,
    OIDCCacheModule,
    ...(config.redis.isEnabled
      ? [PubSubModule.forRoot(redisConfig), CacheModule.registerAsync({ isGlobal: true, useFactory: redisFactory })]
      : [CacheModule.register()]),

    // Modules
    AuthModule,
    GeocodeModule,
    GoogleModule,
    HealthModule,
    MeiliSearchModule,
    NationalIdentificationModule,
    NotificationsModule,
    SentryModule,
    TextractModule,
    UploadsModule,

    // Resources
    ActorsModule,
    ActorImagesModule,
    ActorTagsModule,
    AddressesModule,
    BankInfosModule,
    LegalUnitsModule,
    LegalUnitLocationsModule,
    SocialsModule,
    TransactionsModule,

    EventsModule,
    EventFavoritesModule,
    EventJoinsModule,
    EventOrganizesModule,
    EventSupervisorsModule,

    TeamsModule,
    ActionsModule,
    BankAccountsModule,
    ExpensesModule,
    ExpenseItemsModule,
    GrantsModule,
    GrantAllocatesModule,
    MissionsModule,
    MissionJoinsModule,
    ProjectsModule,
    TeamDocumentsModule,
    TeamHistoriesModule,
    TeamJoinsModule,
    TeamMembersModule,
    TeamMemberRolesModule,
    TeamRequiredRolesModule,
    TeamRolesModule,

    TenantsModule,
    CampusesModule,
    CampusClustersModule,
    EventApprovalsModule,
    EventApprovalStepsModule,
    EventApprovalValidatorsModule,
    RequiredDocumentsModule,
    RequiredRolesModule,
    TenantMembersModule,
    TenantMemberRolesModule,
    TenantRolesModule,

    FormsModule,
    FormSubmissionsModule,

    UsersModule,
    FollowsModule,

    LocationsModule,
    TagsModule,
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
  logger = new Logger(AppModule.name);

  constructor(
    private readonly geocodeService: GeocodeService,
    private readonly notificationsService: NotificationsService,
    private readonly uploadsService: UploadsService,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    // Setup sentry
    if (config.sentry.isEnabled) consumer.apply(Sentry.Handlers.requestHandler(), TraceMiddleware).forRoutes('*');

    // Setup loggers
    consumer.apply(RestLoggerMiddleware).exclude('/graphql').forRoutes('*');
  }

  public async onModuleInit() {
    const { domain, name, oidc } = config.baseTenant;

    let admin: User;
    let tenantScope = await this.em.findOne(Tenant, { domain });
    if (tenantScope) {
      admin = await this.em.findOneOrFail(User, { slug: ADMIN_ACCOUNT_SLUG });
    } else {
      // Init base tenant
      tenantScope = new Tenant({
        domain,
        name,
        pointName: 'LXP',
        isOidcEnabled: oidc.enabled,
        oidcCallbackUri: oidc.callbackUri,
        oidcClientId: oidc.clientId,
        oidcClientSecret: oidc.clientSecret,
        oidcDiscoveryUrl: oidc.discoveryUrl,
        oidcName: oidc.name,
        oidcScopes: oidc.scopes,
      });

      tenantScope.tenantRoles.add(
        new TenantRole({ name: 'Étudiant', type: TenantRoleType.Student, color: Colors.Blue, tenantScope }),
      );
      tenantScope.tenantRoles.add(
        new TenantRole({ name: 'Professeur', type: TenantRoleType.Teacher, color: Colors.LightOrange, tenantScope }),
      );
      const administrationRole = new TenantRole({
        name: 'Administration',
        type: TenantRoleType.Administration,
        color: Colors.Red,
        tenantScope,
      });
      tenantScope.tenantRoles.add(administrationRole);

      await this.em.persistAndFlush([tenantScope]);

      const anon = new User({
        slug: ANON_ACCOUNT_SLUG,
        name: `${ANON_ACCOUNT_FIRST_NAME} ${ANON_ACCOUNT_LAST_NAME}`,
        firstName: ANON_ACCOUNT_FIRST_NAME,
        lastName: ANON_ACCOUNT_LAST_NAME,
        email: ANON_ACCOUNT_EMAIL,
        createdBy: null,
        tenantScope,
      });

      admin = new User({
        slug: ADMIN_ACCOUNT_SLUG,
        name: `${ADMIN_ACCOUNT_FIRST_NAME} ${ADMIN_ACCOUNT_LAST_NAME}`,
        firstName: ADMIN_ACCOUNT_FIRST_NAME,
        lastName: ADMIN_ACCOUNT_LAST_NAME,
        email: ADMIN_ACCOUNT_EMAIL,
        createdBy: null,
        tenantScope,
      });

      const adminMembership = new TenantMember({ tenantScope, user: admin });
      adminMembership.tenantMemberRoles.add(
        new TenantMemberRole({ tenantRole: administrationRole, tenantMember: adminMembership, tenantScope }),
      );
      admin.tenantMemberships.add(adminMembership);

      const baseAdminRole = new AdminRole({
        user: admin,
        canCreateTenant: true,
        canManageTenantEntities: true,
        canDeleteTenantEntities: true,
      });

      admin.passwordHash = await hash(config.baseTenant.adminPassword, { secret: Buffer.from(config.pepperSecret) });
      await this.em.persistAndFlush([admin, anon, baseAdminRole]);

      tenantScope.eventValidationForm = new Form({
        schema: [
          {
            name: 'drugs',
            type: ControlType.Checkbox,
            label:
              "L'équipe organisatrice a-t-elle suivi une formation relative à l'organisation d'événement festif et/ou de sensibilisation à la consommation de substances psychoactives ?",
            required: true,
            placeholder: '',
          },
          {
            name: 'serviceProvider',
            type: ControlType.Checkbox,
            label:
              "L'équipe organisatrice a-t-elle recours à un prestataire de services pour l'organisation de l'événement ?",
            required: true,
            placeholder: '',
          },
          {
            name: 'serviceProviderSiret',
            type: ControlType.Text,
            label: 'Si oui, quel est le numéro de SIRET du prestataire de services ?',
            placeholder: '',
          },
          {
            name: 'expectedAttendance',
            type: ControlType.Number,
            label: 'Quel est le nombre approximatif de personnes attendues ?',
            placeholder: '',
          },
        ],
        type: FormType.EventValidationForm,
        isAllowingEditingAnswers: true,
        isAllowingMultipleAnswers: false,
        createdBy: admin,
        tenantScope,
      });

      await this.em.persistAndFlush(tenantScope);

      const novu = this.notificationsService.novu;
      if (novu) {
        let subscribers;
        do {
          this.logger.log('Deleting previous seeded subscribers...');
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

        const admin = await this.em.findOneOrFail(User, { slug: ADMIN_ACCOUNT_SLUG });
        this.logger.log(`Adding admin (${admin.id}) subscriber to Novu...`);
        await novu.subscribers.identify(admin.id, {
          email: ADMIN_ACCOUNT_EMAIL,
          firstName: ADMIN_ACCOUNT_FIRST_NAME,
          lastName: ADMIN_ACCOUNT_LAST_NAME,
          locale: 'fr',
        });
      } else {
        this.logger.log('Novu is not configured, skipping subscribers seeding...');
      }
    }

    // Seed base tenant

    const teams = await this.em.find(Team, { tenantScope: { domain } });
    if (teams.length === 0) {
      DatabaseSeeder.admin = admin;
      DatabaseSeeder.tenant = tenantScope;
      DatabaseSeeder.geocodeService = this.geocodeService;
      DatabaseSeeder.uploadService = this.uploadsService;
      DatabaseSeeder.entityManager = this.em;

      const seeder = this.orm.getSeeder();
      await seeder.seed(DatabaseSeeder);
    }
  }
}
