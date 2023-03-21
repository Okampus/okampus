import { Tag } from '../../../resources/label/tag/tag.entity';
import { Factory } from '@mikro-orm/seeder';
import { toSlug } from '@okampus/shared/utils';
import { nanoid } from 'nanoid';

import type { TagOptions } from '../../../resources/label/tag/tag.options';
import type { Tenant } from '../../../resources/org/tenant/tenant.entity';
import type { EntityManager } from '@mikro-orm/core';
import type { Faker } from '@mikro-orm/seeder';

export class TagSeeder extends Factory<Tag> {
  model = Tag;

  constructor(em: EntityManager, private readonly tenant: Tenant) {
    super(em);
  }

  public definition(faker: Faker): TagOptions {
    const name = faker.word.noun();

    return {
      name,
      slug: toSlug(`${name}.${nanoid(4)}`),
      createdBy: null,
      tenant: this.tenant.tenant,
    };
  }
}
