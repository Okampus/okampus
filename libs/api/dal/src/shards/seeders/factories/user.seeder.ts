import { User } from '../../../resources/actor/user/user.entity';
import { Factory } from '@mikro-orm/seeder';
import { toSlug } from '@okampus/shared/utils';
import { nanoid } from 'nanoid';
import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import type { Tenant } from '../../../resources/org/tenant/tenant.entity';
import type { ScopeRole } from '@okampus/shared/enums';
import type { UserOptions } from '../../../resources/actor/user/user.options';

export class UserSeeder extends Factory<User> {
  tenant: Tenant;
  scopeRole: ScopeRole;
  passwordHash: string;
  model = User;

  constructor(em: EntityManager, tenant: Tenant, scopeRole: ScopeRole, passwordHash: string) {
    super(em);
    this.tenant = tenant;
    this.scopeRole = scopeRole;
    this.passwordHash = passwordHash;
  }

  public definition(faker: Faker): UserOptions {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      tenant: this.tenant.tenant,
      slug: toSlug(`${firstName}.${lastName}.${nanoid(4)}`),
      name: firstName + ' ' + lastName,
      firstName,
      lastName,
      primaryEmail: toSlug(`${firstName}.${lastName}@${this.tenant.tenant.domain}.fr`),
      passwordHash: this.passwordHash,
      scopeRole: this.scopeRole,
    };
  }
}
