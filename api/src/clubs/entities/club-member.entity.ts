import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Expose } from 'class-transformer';
import { CLUBMEMBER_CLUB_INCLUDED } from '../../shared/lib/constants';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { ClubRole } from '../../shared/lib/types/club-role.enum';
import { User } from '../../users/user.entity';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Club } from './club.entity';

@Entity()
export class ClubMember extends BaseEntity {
  @PrimaryKey()
  clubMemberId!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @ManyToOne('Club', { onDelete: 'CASCADE' })
  @Expose({ groups: [CLUBMEMBER_CLUB_INCLUDED] })
  @Index()
  club!: Club;

  @Enum(() => ClubRole)
  role!: ClubRole;

  @Property()
  roleLabel?: string;

  @Property()
  joinDate = new Date();

  constructor(options: {
    user: User;
    club: Club;
    role: ClubRole;
    roleLabel?: string;
  }) {
    super();
    this.user = options.user;
    this.club = options.club;
    this.role = options.role;
    this.roleLabel = options.roleLabel;
  }
}
