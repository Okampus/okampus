import { User } from '@okampus/api/dal';
import { randomId, toSlug } from '@okampus/shared/utils';

import { faker } from '@faker-js/faker/locale/fr';
import { Factory } from '@mikro-orm/seeder';

import type { EntityManager } from '@mikro-orm/core';
import type { Tenant, UserOptions } from '@okampus/api/dal';

export class UserSeeder extends Factory<User> {
  model = User;

  constructor(
    em: EntityManager,
    private readonly tenant: Tenant,
    private readonly passwordHash: string,
  ) {
    super(em);
  }

  public definition(): UserOptions {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;

    return {
      slug: toSlug(`${name}-${randomId()}`),
      name,
      firstName,
      lastName,
      passwordHash: this.passwordHash,
      email: `${toSlug(firstName)}.${toSlug(lastName)}@${toSlug(this.tenant.domain)}.fr`,
      createdBy: null,
      tenant: this.tenant,
    };
  }
}
