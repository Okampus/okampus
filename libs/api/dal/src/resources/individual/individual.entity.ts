import { BotInfo } from './bot-info/bot-info.entity';
import { UserInfo } from './user-info/user-info.entity';
import { IndividualRepository } from './individual.repository';
import { TenantScopedEntity } from '..';
import { Actor } from '../actor/actor.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, OneToOne, Property } from '@mikro-orm/core';
import { ScopeRole } from '@okampus/shared/enums';

import type { IndividualOptions } from './individual.options';

@Entity({ customRepository: () => IndividualRepository })
export class Individual extends TenantScopedEntity {
  [EntityRepositoryType]!: IndividualRepository;

  @OneToOne({ type: 'Actor', mappedBy: 'individual' })
  actor!: Actor;

  @OneToOne({ type: 'UserInfo', inversedBy: 'individual', nullable: true })
  user: UserInfo | null = null;

  @OneToOne({ type: 'BotInfo', inversedBy: 'individual', nullable: true })
  bot: BotInfo | null = null;

  @Property({ type: 'text', hidden: true, nullable: true, default: null })
  passwordHash: string | null = null;

  @Enum({ items: () => ScopeRole, type: EnumType })
  scopeRole!: ScopeRole;

  // @OneToMany('BadgeUnlock', 'user')
  // badgesUnlocked = new Collection<BadgeUnlock>(this);

  constructor(options: IndividualOptions) {
    super(options);
    this.assign(options);

    this.actor = new Actor({
      name: options.name,
      bio: options.bio,
      email: options.email,
      slug: options.slug,
      tags: options.tags,
      createdBy: options.createdBy,
      tenant: options.tenant,
      individual: this,
    });

    if (options.userInfo) {
      this.user = new UserInfo({
        ...options.userInfo,
        individual: this,
        createdBy: options.createdBy,
        tenant: options.tenant,
      });
    } else if (options.botInfo) {
      this.bot = new BotInfo({
        ...options.botInfo,
        individual: this,
        createdBy: options.createdBy,
        tenant: options.tenant,
      });
    }
  }
}
