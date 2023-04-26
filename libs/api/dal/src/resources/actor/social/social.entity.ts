import { TenantScopedEntity } from '../..';
import { Entity, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { SocialType } from '@okampus/shared/enums';
import type { Actor } from '../../actor/actor.entity';
import type { SocialOptions } from './social.options';

@Entity()
export class Social extends TenantScopedEntity {
  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @Enum({ items: () => SocialType, type: EnumType })
  type!: SocialType;

  @Property({ type: 'text' })
  url!: string;

  @Property({ type: 'text' })
  pseudo!: string;

  constructor(options: SocialOptions) {
    super(options);
    this.assign(options);
  }
}
