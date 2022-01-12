import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { User } from '../users/user.entity';
import { Club } from './club.entity';

@Entity()
export class ClubMember extends BaseEntity {
  @PrimaryKey()
  clubMemberId!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne({ onDelete: 'CASCADE' })
  club!: Club;

  @Property({ type: 'text' })
  role!: string;

  @Property()
  joinDate = new Date();

  constructor(options: {
    user: User;
    club: Club;
    role: string;
  }) {
    super();
    this.user = options.user;
    this.club = options.club;
    this.role = options.role;
  }
}
