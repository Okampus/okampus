import { SocialRepository } from './social.repository';
import { TenantScopableEntity } from '../..';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { SocialType } from '@okampus/shared/enums';

import type { SocialOptions } from './social.options';
import type { Actor } from '../../actor/actor.entity';

@Entity({ customRepository: () => SocialRepository })
export class Social extends TenantScopableEntity {
  [EntityRepositoryType]!: SocialRepository;

  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @Property({ type: 'smallint' })
  order!: number;

  @Enum({ items: () => SocialType, type: EnumType })
  type!: SocialType;

  @Property({ type: 'text' })
  pseudo!: string;

  @Property({ type: 'text' })
  url!: string;

  constructor(options: SocialOptions) {
    super(options);
    this.assign(options);
  }
}
