import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from '@common/configs/config';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { Role } from '@common/modules/authorization/types/role.enum';
import { SchoolRole } from '@common/modules/authorization/types/school-role.enum';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Class } from '@modules/org/classes/class.entity';
import { ClassMembershipsModule } from '@modules/org/classes/memberships/memberships.module';
import { SchoolYear } from '@modules/org/classes/school-year/school-year.entity';
import { InterestsModule } from '@modules/org/teams/interests/interests.module';
import { Social } from '@modules/org/teams/socials/social.entity';
import { SocialsModule } from '@modules/org/teams/socials/socials.module';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { FileUploadsModule } from '@modules/upload/file-uploads/file-uploads.module';
import { ProfileImage } from '@modules/upload/profile-images/profile-image.entity';
import { ProfileImagesModule } from '@modules/upload/profile-images/profile-images.module';
import { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import { GdprModule } from '../gdpr/gdpr.module';
import { Statistics } from '../statistics/statistics.entity';
import { StatisticsModule } from '../statistics/statistics.module';
import { User } from './user.entity';

import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import './user.subscriber';

@Module({
  imports: [
    MikroOrmModule.forFeature([ProfileImage, User, Statistics, BadgeUnlock, Class, SchoolYear, Social, Tenant]),
    StatisticsModule,
    ProfileImagesModule,
    FileUploadsModule,
    GdprModule,
    ClassMembershipsModule,
    InterestsModule,
    SocialsModule,
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

    const admin = await this.userRepository.findOne({ id: config.adminAccount.username });
    if (!admin) {
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
    } else if (!(await admin.validatePassword(config.adminAccount.password))) {
      await admin.setPassword(config.adminAccount.password);
      await this.userRepository.persistAndFlush(admin);
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
