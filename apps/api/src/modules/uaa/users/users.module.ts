import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ClassMembershipsModule } from '@classes/memberships/memberships.module';
import { Role } from '@common/modules/authorization/types/role.enum';
import { ScopeRole } from '@common/modules/authorization/types/scope-role.enum';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { config } from '@configs/config';
import { BaseRepository } from '@lib/orm/base.repository';
import { _slugify } from '@lib/utils/slugify';
import { InterestsModule } from '@teams/interests/interests.module';
import { Social } from '@teams/socials/social.entity';
import { SocialsModule } from '@teams/socials/socials.module';
import { TenantsCoreModule } from '@tenants/core-tenants.module';
import { TenantsService } from '@tenants/tenants.service';
import { BadgeUnlock } from '@uaa/badges/entities/badge-unlock.entity';
import { GdprModule } from '@uaa/gdpr/gdpr.module';
import { Statistics } from '@uaa/statistics/statistics.entity';
import { StatisticsModule } from '@uaa/statistics/statistics.module';
import { UserImagesModule } from '@uaa/user-images/user-images.module';
import { FileUploadsModule } from '@upload/file-uploads/file-uploads.module';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import './user.subscriber';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Statistics, BadgeUnlock, Social]),
    StatisticsModule,
    UserImagesModule,
    FileUploadsModule,
    GdprModule,
    ClassMembershipsModule,
    InterestsModule,
    SocialsModule,
    TenantsCoreModule,
  ],
  controllers: [UsersController],
  providers: [CaslAbilityFactory, UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly tenantsService: TenantsService,
  ) {}

  public async onModuleInit(): Promise<void> {
    let tenant = await this.tenantsService.findBareTenant(_slugify(config.baseTenant.name));
    if (!tenant) {
      tenant = await this.tenantsService.create({
        name: config.baseTenant.name,
        oidcEnabled: config.baseTenant.oidc.enabled,
        oidcClientId: config.baseTenant.oidc.clientId,
        oidcClientSecret: config.baseTenant.oidc.clientSecret,
        oidcDiscoveryUrl: config.baseTenant.oidc.discoveryUrl,
        oidcScopes: config.baseTenant.oidc.scopes,
        oidcCallbackUri: config.baseTenant.oidc.callbackUri,
      });
    }

    const admin = await this.userRepository.findOne({ id: config.adminAccount.username });
    if (!admin) {
      const user = new User({
        id: config.adminAccount.username,
        name: config.adminAccount.firstName,
        lastName: config.adminAccount.lastName,
        email: config.adminAccount.email,
        scopeRole: ScopeRole.Admin,
      }, tenant);
      await user.setPassword(config.adminAccount.password);
      user.roles.push(Role.Moderator, Role.TenantAdmin);
      await this.userRepository.persistAndFlush(user);
    } else if (!(await admin.validatePassword(config.adminAccount.password))) {
      await admin.setPassword(config.adminAccount.password);
      await this.userRepository.persistAndFlush(admin);
    }

    const anon = await this.userRepository.count({ id: config.anonAccount.username });
    if (anon === 0) {
      const user = new User({
        id: config.anonAccount.username,
        name: config.anonAccount.firstName,
        lastName: config.anonAccount.lastName,
        email: config.anonAccount.email,
        scopeRole: ScopeRole.Student,
      }, tenant);
      await user.setPassword(config.anonAccount.password);
      await this.userRepository.persistAndFlush(user);
    }
  }
}
