import { OrgRepository } from './org.repository';
import { Actor } from '../actor/actor.entity';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne } from '@mikro-orm/core';
import { OrgKind } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';
import type { OrgOptions } from './org.options';

import type { OrgDocument } from '../manage-org/org-document/org-document.entity';

@Entity({
  customRepository: () => OrgRepository,
  discriminatorColumn: 'orgKind',
  discriminatorMap: OrgKind,
  abstract: true,
})
export class Org extends TenantScopedEntity {
  @Enum({ items: () => OrgKind, type: 'string' })
  orgKind!: OrgKind;

  @OneToOne({ type: 'Actor', inversedBy: 'org' })
  actor!: Actor;

  @ManyToOne({ type: 'Org', nullable: true, cascade: [Cascade.ALL] })
  parent: Org | null = null;

  @OneToMany({ type: 'Org', mappedBy: 'parent' })
  @TransformCollection()
  children = new Collection<Org>(this);

  @OneToMany({ type: 'OrgDocument', mappedBy: 'org', cascade: [Cascade.ALL] })
  @TransformCollection()
  documents = new Collection<OrgDocument>(this);

  constructor(options: OrgOptions & { orgKind: OrgKind }) {
    super({ tenant: options.tenant });
    this.assign(options);
    this.actor = new Actor({
      org: this,
      name: options.name,
      bio: options.bio,
      tenant: options.tenant,
      primaryEmail: options.primaryEmail,
      slug: options.slug,
      tags: options.tags,
    });
  }
}
