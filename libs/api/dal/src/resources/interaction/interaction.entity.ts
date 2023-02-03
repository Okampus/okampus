import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { InteractionKind } from '@okampus/shared/enums';
import { Ugc } from '../ugc/ugc.entity';
import { Actor } from '../actor/actor.entity';
import { ContentMaster } from '../content-master/content-master.entity';
import { InteractionOptions } from './interaction.options';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';

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
