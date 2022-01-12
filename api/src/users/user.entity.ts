import {
  Collection,
  Entity,
  Enum,
  Index,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import { nanoid } from 'nanoid';
import type { BadgeUnlock } from '../badges/badge-unlock.entity';
import { EMAIL_INCLUDED } from '../shared/lib/constants';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { Role } from '../shared/modules/authorization/types/role.enum';

@Entity()
export class User extends BaseEntity {
  @PrimaryKey()
  userId: string = nanoid(10);

  @Property({ type: 'text' })
  @Unique()
  @Index()
  username!: string;

  @Property({ type: 'text' })
  @Unique()
  @Index()
  @Expose({ groups: [EMAIL_INCLUDED] })
  email!: string;

  @Property({ type: 'text' })
  @Exclude()
  password!: string;

  @OneToMany('BadgeUnlock', 'user')
  @Exclude()
  badges = new Collection<BadgeUnlock>(this);

  // TODO: Add full 'reputation' support
  @Property()
  reputation = 0;

  // TODO: Add full 'avatar' support
  @Property({ type: 'text' })
  avatar?: string;

  @Enum({ items: () => Role, array: true, default: [Role.User] })
  roles: Role[] = [Role.User];

  @Property({ type: 'text' })
  color?: string;

  @Property({ type: 'text' })
  signature?: string;

  // TODO: Add full 'banner' support
  @Property({ type: 'text' })
  banner?: string;

  constructor(username: string, email: string) {
    super();
    this.username = username;
    this.email = email;
  }

  public async setPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
