import { Entity, EntityRepositoryType, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { SocialType } from '@okampus/shared/enums';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Actor } from '../../actor/actor.entity';
import { SocialOptions } from './social.options';
// eslint-disable-next-line import/no-cycle
import { SocialRepository } from './social.repository';

@Entity({ customRepository: () => SocialRepository })
export class Social extends TenantScopedEntity {
  [EntityRepositoryType]!: SocialRepository;

  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @Enum(() => SocialType)
  type!: SocialType;

  @Property({ type: 'text' })
  url!: string;

  @Property({ type: 'text' })
  pseudo!: string;

  constructor(options: SocialOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
