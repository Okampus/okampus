import { Bot } from './bot/bot.entity';
import { User } from './user/user.entity';
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

  @OneToOne({ type: 'User', inversedBy: 'individual', nullable: true })
  user: User | null = null;

  @OneToOne({ type: 'Bot', inversedBy: 'individual', nullable: true })
  bot: Bot | null = null;

  @Property({ type: 'text', hidden: true, nullable: true, default: null })
  passwordHash: string | null = null;

  @Enum({ items: () => ScopeRole, type: EnumType })
  scopeRole!: ScopeRole;

  // @OneToMany('BadgeUnlock', 'user')
  // @TransformCollection()
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

    if (options.userProps) {
      this.user = new User({
        ...options.userProps,
        individual: this,
        createdBy: options.createdBy,
        tenant: options.tenant,
      });
    } else if (options.botProps) {
      this.bot = new Bot({
        ...options.botProps,
        individual: this,
        createdBy: options.createdBy,
        tenant: options.tenant,
      });
    }
  }
}
