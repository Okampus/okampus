import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Expose } from 'class-transformer';
import { CLUBMEMBER_CLUB_INCLUDED } from '../../shared/lib/constants';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { ClubRole } from '../../shared/lib/types/club-role.enum';
import { User } from '../../users/user.entity';
import { Club } from './club.entity';

@Entity()
export class ClubMember extends BaseEntity {
  @PrimaryKey()
  clubMemberId!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne('Club', { onDelete: 'CASCADE' })
  @Expose({ groups: [CLUBMEMBER_CLUB_INCLUDED] })
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
