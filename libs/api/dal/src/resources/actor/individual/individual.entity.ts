import { IndividualRepository } from './individual.repository';
import { Actor } from '../actor.entity';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, OneToOne } from '@mikro-orm/core';
import { IndividualKind } from '@okampus/shared/enums';
import type { IndividualOptions } from './individual.options';

@Entity({
  customRepository: () => IndividualRepository,
  discriminatorColumn: 'individualKind',
  discriminatorMap: IndividualKind,
  abstract: true,
})
export class Individual extends TenantScopedEntity {
  @OneToOne({ type: 'Actor', inversedBy: 'individual' })
  actor!: Actor;

  @Enum({ items: () => IndividualKind, type: 'string' })
  individualKind!: IndividualKind;

  constructor(options: IndividualOptions & { individualKind: IndividualKind }) {
    super({ tenant: options.tenant });
    this.assign(options);

    this.actor = new Actor({
      individual: this,
      name: options.name,
      bio: options.bio,
      tenant: options.tenant,
      primaryEmail: options.primaryEmail,
      slug: options.slug,
      tags: options.tags,
    });
  }
}
