import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';
import { Factory } from '@mikro-orm/seeder';
import { Tenant } from '../../../resources/org/tenant/tenant.entity';
import { User } from '../../../resources/actor/user/user.entity';
import { ScopeRole } from '@okampus/shared/enums';
import { UserOptions } from '../../../resources/actor/user/user.options';
import { toSlug } from '@okampus/shared/utils';
import { nanoid } from 'nanoid';

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
