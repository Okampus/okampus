import { Factory } from '@mikro-orm/seeder';
import { LegalUnit } from '@okampus/api/dal';
import { LegalUnitType } from '@okampus/shared/enums';
import { randomFromArray, toSlug } from '@okampus/shared/utils';
import { faker } from '@faker-js/faker/locale/fr';

import type { Tenant, LegalUnitOptions, Tag } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

export class LegalUnitSeeder extends Factory<LegalUnit> {
  model = LegalUnit;

  constructor(em: EntityManager, private readonly tenant: Tenant, private readonly tags: Tag[]) {
    super(em);
  }

  public definition(): Omit<LegalUnitOptions, 'joinForm'> {
    const name = faker.company.name();

    return {
      name,
      email: `${toSlug(name)}@${this.tenant.domain}.fr`,
      slug: toSlug(name),
      website: faker.internet.url(),
      status: faker.company.catchPhrase(),
      tags: randomFromArray(this.tags, 2, 10),
      type: LegalUnitType.Company,
      siren: faker.datatype.number({ min: 100_000_000, max: 999_999_999 }).toString(),
      legalName: name.toUpperCase(),
      createdBy: null,
      tenant: this.tenant,
    };
  }
}
