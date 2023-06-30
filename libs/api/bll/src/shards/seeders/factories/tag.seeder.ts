import { Factory } from '@mikro-orm/seeder';
import { Tag } from '@okampus/api/dal';
import { toSlug } from '@okampus/shared/utils';
import { TagType } from '@okampus/shared/enums';
import { faker } from '@faker-js/faker/locale/fr';

import { nanoid } from 'nanoid';

import type { Tenant, TagOptions } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';

export class TagSeeder extends Factory<Tag> {
  model = Tag;

  constructor(em: EntityManager, private readonly tenant: Tenant) {
    super(em);
  }

  public definition(): TagOptions {
    const name = faker.word.noun();

    return {
      name,
      type: TagType.Tag,
      slug: toSlug(`${name}.${nanoid(16)}`),
      createdBy: null,
      tenant: this.tenant,
    };
  }
}
