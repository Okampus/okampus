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
  model = User;

  constructor(
    em: EntityManager,
    private readonly tenant: Tenant,
    private readonly scopeRole: ScopeRole,
    private readonly passwordHash: string
  ) {
    super(em);
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
      primaryEmail: `${toSlug(firstName)}.${toSlug(lastName)}@${toSlug(this.tenant.actor.slug)}.fr`,
      passwordHash: this.passwordHash,
      scopeRole: this.scopeRole,
    };
  }
}
