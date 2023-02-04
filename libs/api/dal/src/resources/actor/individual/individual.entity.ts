import { Entity, Enum, OneToOne } from '@mikro-orm/core';
import { Actor } from '../actor.entity';
import { IndividualKind } from '@okampus/shared/enums';
import type { IndividualOptions } from './individual.options';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { IndividualRepository } from './individual.repository';

@Entity({
  customRepository: () => IndividualRepository,
  discriminatorColumn: 'individualKind',
  discriminatorMap: IndividualKind,
  abstract: true,
})
export class Individual extends TenantScopedEntity {
  @OneToOne({ type: 'Actor', inversedBy: 'individual' })
  actor!: Actor;

  @Enum(() => IndividualKind)
  individualKind!: IndividualKind;

  constructor(options: IndividualOptions & { individualKind: IndividualKind }) {
    super({ tenant: options.tenant });
    this.assign(options);

    this.actor = new Actor({
      individual: this,
      name: options.name,
      tenant: options.tenant,
      primaryEmail: options.primaryEmail,
      slug: options.slug,
      tags: options.tags,
    });
  }
}
