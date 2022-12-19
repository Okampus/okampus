import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { ScopeRole } from '@common/modules/authorization/types/scope-role.enum';
import { slugify } from '@lib/utils/slugify';
import type { Tenant } from '@org/tenants/tenant.entity';
import { User } from '@uaa/users/user.entity';

export class UserFactory extends Factory<User> {
  tenant: Tenant;
  scopeRole: ScopeRole;
  model = User;

  constructor(em: EntityManager, tenant: Tenant, scopeRole: ScopeRole) {
    super(em);
    this.tenant = tenant;
    this.scopeRole = scopeRole;
  }

  public definition(faker: Faker): Partial<User> {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      id: nanoid(16),
      tenant: this.tenant,
      name: firstName,
      lastName,
      email: slugify(`${firstName}.${lastName}@${this.tenant.slug}.fr`),
      // eslint-disable-next-line node/no-sync
      password: bcrypt.hashSync('root', 10),
      scopeRole: this.scopeRole,
      bot: this.scopeRole === ScopeRole.AdminBot || this.scopeRole === ScopeRole.UserBot,
    };
  }
}