import {
  ArrayType,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Expose, Transform } from 'class-transformer';
import { CLUB_MEMBERS_INCLUDED } from '../../shared/lib/constants';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { ClubRole } from '../../shared/lib/types/club-role.enum';
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

  @Property({ type: ArrayType })
  socials!: string[];

  @OneToMany(() => ClubMember, member => member.club)
  @Transform(({ obj }: { obj: { members: Collection<string> } }) => {
    if (obj.members.isInitialized())
      return Object.values(obj.members).filter(member => typeof member === 'object');
    return null;
  })
  @Expose({ groups: [CLUB_MEMBERS_INCLUDED] })
  members = new Collection<ClubMember>(this);

  @Property()
  membersCount = 0;

  constructor(options: {
    name: string;
    category: string;
    description: string;
    icon: string;
    socials: string[];
  }) {
    super();
    this.name = options.name;
    this.category = options.category;
    this.description = options.description;
    this.icon = options.icon;
    this.socials = options.socials;
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
