import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne } from '@mikro-orm/core';
import { OrgKind } from '@okampus/shared/enums';
import { OrgOptions } from './org.options';
import { Actor } from '../actor/actor.entity';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
// eslint-disable-next-line import/no-cycle
import { OrgRepository } from './org.repository';
import type { OrgDocument } from '../manage-org/org-document/org-document.entity';
import { TransformCollection } from '@okampus/api/shards';

@Entity({
  customRepository: () => OrgRepository,
  discriminatorColumn: 'orgKind',
  discriminatorMap: OrgKind,
  abstract: true,
})
export class Org extends TenantScopedEntity {
  @Enum(() => OrgKind)
  orgKind!: OrgKind;

  @OneToOne({ type: 'Actor', inversedBy: 'org' })
  actor!: Actor;

  @ManyToOne({ type: 'Org', nullable: true, cascade: [Cascade.ALL] })
  parent: Org | null = null;

  @OneToMany({ type: 'OrgDocument', mappedBy: 'org', cascade: [Cascade.ALL] })
  @TransformCollection()
  documents = new Collection<OrgDocument>(this);

  constructor(options: OrgOptions & { orgKind: OrgKind }) {
    super({ tenant: options.tenant });
    this.assign(options);
    this.actor = new Actor({
      org: this,
      name: options.name,
      tenant: options.tenant,
      primaryEmail: options.primaryEmail,
      slug: options.slug,
      tags: options.tags,
    });
  }
}
