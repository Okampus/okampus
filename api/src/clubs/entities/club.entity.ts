import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Expose } from 'class-transformer';
import { CLUB_MEMBERS_INCLUDED } from '../../shared/lib/constants';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { ClubRole } from '../../shared/lib/types/club-role.enum';
import { ClubSocialAccount } from '../../socials/entities/club-social-account.entity';
import type { User } from '../../users/user.entity';
import { ClubMember } from './club-member.entity';

const ADMIN_ROLES = new Set([ClubRole.President, ClubRole.VicePresident]);

@Entity()
export class Club extends BaseEntity {
  @PrimaryKey()
  clubId!: number;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  category!: string;

  @Property({ type: 'text' })
  description!: string;

  // TODO: Full 'icon' support
  @Property({ type: 'text' })
  icon!: string;

  @OneToMany(() => ClubSocialAccount, account => account.club)
  @TransformCollection()
  socials = new Collection<ClubSocialAccount>(this);

  @OneToMany(() => ClubMember, member => member.club)
  @TransformCollection()
  @Expose({ groups: [CLUB_MEMBERS_INCLUDED] })
  members = new Collection<ClubMember>(this);

  constructor(options: {
    name: string;
    category: string;
    description: string;
    icon: string;
  }) {
    super();
    this.name = options.name;
    this.category = options.category;
    this.description = options.description;
    this.icon = options.icon;
  }

  public getMemberRoles(user: User): ClubRole[] {
    return this.members
      .getItems()
      .filter(member => member.user.userId === user.userId)
      .map(member => member.role);
  }

  public isClubAdmin(user: User): boolean {
    return this.getMemberRoles(user).some(role => ADMIN_ROLES.has(role));
  }

  public canActOnRole(user: User, role: ClubRole): boolean {
    if (!ADMIN_ROLES.has(role))
      return this.isClubAdmin(user);
    return this.getMemberRoles(user).includes(ClubRole.President);
  }
}
