import { Factory } from '@mikro-orm/seeder';
import { Individual } from '@okampus/api/dal';
import { toSlug } from '@okampus/shared/utils';
import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker/locale/fr';

import type { EntityManager } from '@mikro-orm/core';
import type { Tenant, IndividualOptions } from '@okampus/api/dal';
import type { ScopeRole } from '@okampus/shared/enums';

export class UserSeeder extends Factory<Individual> {
  model = Individual;

  constructor(
    em: EntityManager,
    private readonly tenant: Tenant,
    private readonly scopeRole: ScopeRole,
    private readonly passwordHash: string
  ) {
    super(em);
  }

  public definition(): IndividualOptions {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      slug: toSlug(`${firstName}-${lastName}-${nanoid(4)}`),
      name: `${firstName} ${lastName}`,
      userInfo: { firstName, lastName },
      passwordHash: this.passwordHash,
      primaryEmail: `${toSlug(firstName)}.${toSlug(lastName)}@${toSlug(this.tenant.domain)}.fr`,
      scopeRole: this.scopeRole,
      createdBy: null,
      tenant: this.tenant,
    };
  }
}
