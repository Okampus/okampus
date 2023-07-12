import { SocialRepository } from './social.repository';
import { TenantScopedEntity } from '../..';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { SocialType } from '@okampus/shared/enums';
import type { Actor } from '../../actor/actor.entity';
import type { SocialOptions } from './social.options';

@Entity({ customRepository: () => SocialRepository })
export class Social extends TenantScopedEntity {
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
