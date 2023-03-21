import { OrgRepository } from './org.repository';
import { Actor } from '../actor/actor.entity';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Cascade, Collection, Entity, Enum, ManyToMany, ManyToOne, OneToMany, OneToOne } from '@mikro-orm/core';
import { OrgKind } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';

import type { OrgOptions } from './org.options';
import type { OrgDocument } from '../manage-org/org-document/org-document.entity';
import type { TenantEvent } from '../content-master/event/event.entity';

const customRepository = () => OrgRepository;
@Entity({ customRepository, discriminatorColumn: 'orgKind', discriminatorMap: OrgKind, abstract: true })
export class Org extends TenantScopedEntity {
  @Enum({ items: () => OrgKind, type: 'string' })
  orgKind!: OrgKind;

  @OneToOne({ type: 'Actor', inversedBy: 'org' })
  actor!: Actor;

  @ManyToOne({ type: 'Org', nullable: true, cascade: [Cascade.ALL] })
  parent: Org | null = null;

  @ManyToMany({ type: 'TenantEvent', mappedBy: 'orgs' })
  @TransformCollection()
  events = new Collection<TenantEvent>(this);

  @OneToMany({ type: 'Org', mappedBy: 'parent' })
  @TransformCollection()
  children = new Collection<Org>(this);

  @OneToMany({ type: 'OrgDocument', mappedBy: 'org', cascade: [Cascade.ALL] })
  @TransformCollection()
  documents = new Collection<OrgDocument>(this);

  constructor(options: OrgOptions & { orgKind: OrgKind }) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);

    this.actor = new Actor({ ...options, org: this });
  }
}
