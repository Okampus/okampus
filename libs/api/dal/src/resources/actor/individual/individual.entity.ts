import { IndividualRepository } from './individual.repository';
import { Actor } from '../actor.entity';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';

import { Entity, Enum, OneToOne, Property } from '@mikro-orm/core';
import { IndividualKind } from '@okampus/shared/enums';

import type { IndividualOptions } from './individual.options';

const customRepository = () => IndividualRepository;
@Entity({ customRepository, discriminatorColumn: 'individualKind', discriminatorMap: IndividualKind, abstract: true })
export class Individual extends TenantScopedEntity {
  @Enum({ items: () => IndividualKind, type: 'string' })
  individualKind!: IndividualKind;

  @OneToOne({ type: 'Actor', inversedBy: 'individual' })
  actor!: Actor;

  @Property({ type: 'text' })
  status = '';

  constructor(options: IndividualOptions & { individualKind: IndividualKind }) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);

    this.actor = new Actor({
      individual: this,
      name: options.name,
      bio: options.bio,
      primaryEmail: options.primaryEmail,
      slug: options.slug,
      tags: options.tags,
      createdBy: options.createdBy,
      tenant: options.tenant,
    });
  }
}
