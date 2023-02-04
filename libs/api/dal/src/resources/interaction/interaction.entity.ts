import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { InteractionKind } from '@okampus/shared/enums';
import type { Ugc } from '../ugc/ugc.entity';
import type { Actor } from '../actor/actor.entity';
import type { ContentMaster } from '../content-master/content-master.entity';
import type { InteractionOptions } from './interaction.options';

@Entity({
  discriminatorColumn: 'interactionKind',
  discriminatorMap: InteractionKind,
  abstract: true,
})
export class Interaction extends TenantScopedEntity {
  @Enum(() => InteractionKind)
  interactionKind!: InteractionKind;

  @ManyToOne({ type: 'Ugc' })
  content!: Ugc;

  @ManyToOne({ type: 'ContentMaster', nullable: true })
  linkedContentMaster: ContentMaster | null = null;

  @ManyToOne({ type: 'Actor' })
  actor!: Actor;

  constructor(options: InteractionOptions & { interactionKind: InteractionKind }) {
    super(options);
    this.assign(options);
  }
}
