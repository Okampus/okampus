import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import { FileUploadsModule } from '../files/file-uploads/file-uploads.module';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { ProfileImagesModule } from '../files/profile-images/profile-images.module';
import { SchoolGroupMembershipsModule } from '../school-group/memberships/memberships.module';
import { SchoolGroup } from '../school-group/school-group.entity';
import { SchoolYear } from '../school-group/school-year/school-year.entity';
import { config } from '../shared/configs/config';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { Role } from '../shared/modules/authorization/types/role.enum';
import { SchoolRole } from '../shared/modules/authorization/types/school-role.enum';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Statistics } from '../statistics/statistics.entity';
import { StatisticsModule } from '../statistics/statistics.module';
import { Tenant } from '../tenants/tenants/tenant.entity';
import { GdprModule } from './gdpr/gdpr.module';
import { User } from './user.entity';

import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import './user.subscriber';

@Module({
  imports: [
    MikroOrmModule.forFeature([ProfileImage, User, Statistics, BadgeUnlock, SchoolGroup, SchoolYear, Tenant]),
    StatisticsModule,
    ProfileImagesModule,
    FileUploadsModule,
    GdprModule,
    SchoolGroupMembershipsModule,
  ],
  controllers: [UsersController],
  providers: [CaslAbilityFactory, UsersService, JwtService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
  ) {}

  public async onModuleInit(): Promise<void> {
    let tenant = await this.tenantRepository.findOne({ id: config.baseTenant.id });
    if (!tenant) {
      tenant = new Tenant({
        id: config.baseTenant.id,
        oidcEnabled: config.baseTenant.oidc.enabled,
        oidcClientId: config.baseTenant.oidc.clientId,
        oidcClientSecret: config.baseTenant.oidc.clientSecret,
        oidcDiscoveryUrl: config.baseTenant.oidc.discoveryUrl,
        oidcScopes: config.baseTenant.oidc.scopes,
        oidcCallbackUri: config.baseTenant.oidc.callbackUri,
      });
      await this.tenantRepository.persistAndFlush(tenant);
    }

    const admin = await this.userRepository.count({ id: config.adminAccount.username });
    if (admin === 0) {
      const user = new User({
        tenant,
        id: config.adminAccount.username,
        firstname: config.adminAccount.firstName,
        lastname: config.adminAccount.lastName,
        email: config.adminAccount.email,
        schoolRole: SchoolRole.Admin,
      });
      await user.setPassword(config.adminAccount.password);
      user.roles.push(Role.Moderator, Role.Admin);
      await this.userRepository.persistAndFlush(user);
    }

    const anon = await this.userRepository.count({ id: config.anonAccount.username });
    if (anon === 0) {
      const user = new User({
        tenant,
        id: config.anonAccount.username,
        firstname: config.anonAccount.firstName,
        lastname: config.anonAccount.lastName,
        email: config.anonAccount.email,
        schoolRole: SchoolRole.Student,
      });
      await user.setPassword(config.anonAccount.password);
      await this.userRepository.persistAndFlush(user);
    }
  }
}
