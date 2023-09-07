import { LegalUnit } from '@okampus/api/dal';
import { LegalUnitType } from '@okampus/shared/enums';

import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker/locale/fr';

import type { LegalUnitOptions, Tag } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

export class LegalUnitSeeder extends Factory<LegalUnit> {
  model = LegalUnit;

  constructor(
    em: EntityManager,
    private readonly type: LegalUnitType,
    private readonly tags: Tag[],
  ) {
    super(em);
  }

  public definition(): LegalUnitOptions {
    const name = faker.company.name();

    return {
      name,
      website: faker.internet.url(),
      status: faker.company.catchPhrase(),
      bankCode: this.type === LegalUnitType.Bank ? faker.number.int({ min: 0, max: 99_999 }) : null,
      type: this.type,
      siren: faker.number.int({ min: 100_000_000, max: 999_999_999 }).toString(),
      legalName: name.toUpperCase(),
      createdBy: null,
    };
  }
}
