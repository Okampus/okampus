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
import { BASE_TENANT } from '@okampus/shared/consts';
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
    this.pepper = Buffer.from(this.configService.config.crypto.pepper);
  }

  public async onModuleInit(): Promise<void> {
    const { baseTenant, adminAccount, anonAccount } = this.configService.config;

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

    let admin = await this.userRepository.findOne({ actor: { slug: adminAccount.slug } });
    if (!admin) {
      admin = new User({
        tenant: coreTenant,
        slug: adminAccount.slug,
        firstName: adminAccount.firstName,
        lastName: adminAccount.lastName,
        primaryEmail: adminAccount.email,
        scopeRole: ScopeRole.Admin,
        roles: [RoleType.Moderator, RoleType.TenantAdmin],
      });

      admin.passwordHash = await hash(adminAccount.password, { secret: this.pepper });
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
    // else if (!(await admin.validatePassword(adminAccount.password))) { // TODO: change password on env pwd change
    //   await admin.setPassword(adminAccount.password);
    //   await this.userRepository.persistAndFlush(admin);
    // }

    const anon = await this.userRepository.count({ actor: { slug: anonAccount.slug } });
    if (!anon) {
      const anonUser = new User({
        tenant: coreTenant,
        slug: anonAccount.slug,
        firstName: anonAccount.firstName,
        lastName: anonAccount.lastName,
        primaryEmail: anonAccount.email,
        scopeRole: ScopeRole.Admin,
      });

      await this.userRepository.persistAndFlush(anonUser);
    }
  }
}
