import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CreateUserHandler } from './commands/create-user/create-user.handler';
import { GetUserByIdHandler } from './queries/get-user-by-id/get-user-by-id.handler';
import { GetUsersHandler } from './queries/get-users/get-users.handler';
import { UpdateUserHandler } from './commands/update-user/update-user.handler';
import { DeleteUserHandler } from './commands/delete-user/delete-user.handler';
import { GetUserBySlugHandler } from './queries/get-user-by-slug/get-user-by-slug.handler';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '../../../global/config.module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BaseRepository, TenantRepository, UserRepository, EventApprovalStepRepository } from '@okampus/api/dal';

import { RoleType, ScopeRole } from '@okampus/shared/enums';
import { TenantCore, Tenant, User, Actor, EventApprovalStep } from '@okampus/api/dal';
import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import {
  ADMIN_ACCOUNT_EMAIL,
  ADMIN_ACCOUNT_FIRST_NAME,
  ADMIN_ACCOUNT_LAST_NAME,
  ADMIN_ACCOUNT_SLUG,
  ANON_ACCOUNT_EMAIL,
  ANON_ACCOUNT_FIRST_NAME,
  ANON_ACCOUNT_LAST_NAME,
  ANON_ACCOUNT_SLUG,
  BASE_TENANT,
} from '@okampus/shared/consts';
import { hash } from 'argon2';
import type { OnModuleInit } from '@nestjs/common';

const commandHandlers = [CreateUserHandler, UpdateUserHandler, DeleteUserHandler];
const queryHandlers = [GetUserByIdHandler, GetUsersHandler, GetUserBySlugHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([User, Tenant, TenantCore, Actor, EventApprovalStep])],
  providers: [UsersResolver, UsersService, ...commandHandlers, ...queryHandlers],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  pepper: Buffer;

  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(TenantCore) private readonly tenantCoreRepository: BaseRepository<TenantCore>,
    private readonly tenantRepository: TenantRepository,
    private readonly eventApprovalStepRepository: EventApprovalStepRepository,
    private readonly configService: ConfigService
  ) {
    this.pepper = Buffer.from(this.configService.config.cryptoSecret);
  }

  public async onModuleInit(): Promise<void> {
    const { baseTenant, adminAccountPassword } = this.configService.config;

    let coreTenant: TenantCore | null = null;
    let tenant = await this.tenantRepository.findOne({ tenant: { domain: BASE_TENANT } });
    if (tenant) {
      coreTenant = tenant.tenant;
    } else {
      coreTenant = await this.tenantCoreRepository.findOne({ domain: BASE_TENANT });
      if (!coreTenant) {
        coreTenant = new TenantCore({
          name: baseTenant.name,
          domain: BASE_TENANT,
          oidcInfo: {
            oidcEnabled: baseTenant.oidc.enabled,
            oidcName: baseTenant.oidc.name,
            oidcClientId: baseTenant.oidc.clientId,
            oidcClientSecret: baseTenant.oidc.clientSecret,
            oidcDiscoveryUrl: baseTenant.oidc.discoveryUrl,
            oidcScopes: baseTenant.oidc.scopes,
            oidcCallbackUri: baseTenant.oidc.callbackUri,
          },
        });
      }

      tenant = new Tenant({
        tenant: coreTenant,
        name: baseTenant.name,
        slug: BASE_TENANT,
      });

      await this.tenantRepository.persistAndFlush(tenant);
      await this.tenantCoreRepository.persistAndFlush(coreTenant);
    }

    let admin = await this.userRepository.findOne({ actor: { slug: ADMIN_ACCOUNT_SLUG } });
    if (!admin) {
      admin = new User({
        tenant: coreTenant,
        slug: ADMIN_ACCOUNT_SLUG,
        firstName: ADMIN_ACCOUNT_FIRST_NAME,
        lastName: ADMIN_ACCOUNT_LAST_NAME,
        primaryEmail: ADMIN_ACCOUNT_EMAIL,
        scopeRole: ScopeRole.Admin,
        roles: [RoleType.Moderator, RoleType.TenantAdmin],
      });

      admin.passwordHash = await hash(adminAccountPassword, { secret: this.pepper });
      await this.userRepository.persistAndFlush(admin);

      const step1 = new EventApprovalStep({
        createdBy: admin,
        tenantOrg: tenant,
        tenant: coreTenant,
        name: 'Validation de principe',
        order: 1,
      });
      const step2 = new EventApprovalStep({
        createdBy: admin,
        tenantOrg: tenant,
        tenant: coreTenant,
        name: 'Validation campus',
        order: 2,
      });
      const step3 = new EventApprovalStep({
        createdBy: admin,
        tenantOrg: tenant,
        tenant: coreTenant,
        name: 'Validation du directeur',
        order: 3,
      });

      this.eventApprovalStepRepository.persistAndFlush([step1, step2, step3]);
      this.tenantRepository.flush();
    }

    const anon = await this.userRepository.count({ actor: { slug: ANON_ACCOUNT_SLUG } });
    if (!anon) {
      const anonUser = new User({
        tenant: coreTenant,
        slug: ANON_ACCOUNT_SLUG,
        firstName: ANON_ACCOUNT_FIRST_NAME,
        lastName: ANON_ACCOUNT_LAST_NAME,
        primaryEmail: ANON_ACCOUNT_EMAIL,
        scopeRole: ScopeRole.Admin,
      });

      await this.userRepository.persistAndFlush(anonUser);
    }
  }
}
