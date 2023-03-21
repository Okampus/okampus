import { SocialRepository } from './social.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { SocialType } from '@okampus/shared/enums';
import type { Actor } from '../../actor/actor.entity';
import type { SocialOptions } from './social.options';

@Entity({ customRepository: () => SocialRepository })
export class Social extends TenantScopedEntity {
  [EntityRepositoryType]!: SocialRepository;

  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @Enum({ items: () => SocialType, type: 'string' })
  type!: SocialType;

  @Property({ type: 'text' })
  url!: string;

  @Property({ type: 'text' })
  pseudo!: string;

  constructor(options: SocialOptions) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);
  }
}
