import { Bot } from './bot/bot.entity';
import { User } from './user/user.entity';
import { IndividualRepository } from './individual.repository';
import { TenantScopedEntity } from '..';
import { Actor } from '../actor/actor.entity';
import { Collection, Entity, EntityRepositoryType, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import type { AdminRole } from '../tenant/admin-role/admin-role.entity';
import type { IndividualOptions } from './individual.options';

@Entity({ customRepository: () => IndividualRepository })
export class Individual extends TenantScopedEntity {
  [EntityRepositoryType]!: IndividualRepository;

  @Property({ type: 'text', nullable: true, default: null, hidden: true })
  passwordHash: string | null = null;

  @Property({ type: 'text', default: '' })
  contentSignature = '';

  @OneToOne({ type: 'Actor', inversedBy: 'individual' })
  actor: Actor;

  @OneToOne({ type: 'User', mappedBy: 'individual' })
  user?: User;

  @OneToOne({ type: 'Bot', mappedBy: 'individual' })
  bot?: Bot;

  @OneToMany({ type: 'AdminRole', mappedBy: 'individual' })
  @TransformCollection()
  adminRoles = new Collection<AdminRole>(this);

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
