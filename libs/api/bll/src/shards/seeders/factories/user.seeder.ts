import { Factory } from '@mikro-orm/seeder';
import { Individual } from '@okampus/api/dal';
import { randomId, toSlug } from '@okampus/shared/utils';
import { faker } from '@faker-js/faker/locale/fr';

import type { EntityManager } from '@mikro-orm/core';
import type { Tenant, IndividualOptions } from '@okampus/api/dal';

export class UserSeeder extends Factory<Individual> {
  model = Individual;

  constructor(em: EntityManager, private readonly tenant: Tenant, private readonly passwordHash: string) {
    super(em);
  }

  public definition(): IndividualOptions {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;

    return {
      slug: toSlug(`${name}-${randomId()}`),
      name,
      userProps: { firstName, lastName },
      passwordHash: this.passwordHash,
      email: `${toSlug(firstName)}.${toSlug(lastName)}@${toSlug(this.tenant.domain)}.fr`,
      createdBy: null,
      tenant: this.tenant,
    };
  }
}
