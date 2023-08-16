import { LegalUnitLocation } from '@okampus/api/dal';
import { LegalUnitLocationType, LegalUnitType } from '@okampus/shared/enums';
import { pickOneFromArray, randomFromArray, toSlug } from '@okampus/shared/utils';

import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker/locale/fr';

import type { Tenant, Tag, LegalUnitLocationOptions, LegalUnit } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

export class LegalUnitLocationSeeder extends Factory<LegalUnitLocation> {
  model = LegalUnitLocation;

  constructor(
    em: EntityManager,
    private readonly legalUnits: LegalUnit[],
    private readonly tenant: Tenant,
    private readonly tags: Tag[],
  ) {
    super(em);
  }

  public definition(): LegalUnitLocationOptions {
    const name = faker.company.name();
    const legalUnit = pickOneFromArray(this.legalUnits);

    return {
      name,
      email: `${toSlug(name)}@${this.tenant.domain}.fr`,
      website: faker.internet.url(),
      status: faker.company.catchPhrase(),
      tags: randomFromArray(this.tags, 2, 10),
      locationType: LegalUnitLocationType.Location,
      bankLocationCode: legalUnit.type === LegalUnitType.Bank ? faker.number.int({ min: 0, max: 99_999 }) : null,
      legalUnit,
      legalName: name.toUpperCase(),
      createdBy: null,
      tenant: this.tenant,
    };
  }
}
