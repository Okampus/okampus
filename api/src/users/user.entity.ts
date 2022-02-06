import {
  Cascade,
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import type { BadgeUnlock } from '../badges/badge-unlock.entity';
import { EMAIL_INCLUDED, PERSONAL_INFO_INCLUDED, STATISTICS_INCLUDED } from '../shared/lib/constants';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { UserCreationOptions } from '../shared/lib/types/user-creation-options.interface';
import { Role } from '../shared/modules/authorization/types/role.enum';
import { SchoolRole } from '../shared/modules/authorization/types/school-role.enum';
// eslint-disable-next-line import/no-cycle
import { Statistics } from '../statistics/statistics.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryKey()
  userId: string;

  @Property({ type: 'text' })
  @Expose({ groups: [PERSONAL_INFO_INCLUDED] })
  firstname!: string;

  @Property({ type: 'text' })
  @Expose({ groups: [PERSONAL_INFO_INCLUDED] })
  lastname!: string;

  @Property({ type: 'text' })
  fullname!: string;

  @Property({ type: 'text' })
  @Exclude()
  password?: string;

  @Property({ type: 'text' })
  @Expose({ groups: [EMAIL_INCLUDED] })
  email!: string;

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

  @Enum(() => SchoolRole)
  schoolRole!: SchoolRole;

  @Property({ type: 'text' })
  color?: string;

  @Property({ type: 'text' })
  signature?: string;

  // TODO: Add full 'banner' support
  @Property({ type: 'text' })
  @Expose({ groups: [PERSONAL_INFO_INCLUDED] })
  banner?: string;

  @Property({ type: 'text' })
  @Expose({ groups: [PERSONAL_INFO_INCLUDED] })
  description?: string;

  @Expose({ groups: [STATISTICS_INCLUDED] })
  @OneToOne(() => Statistics, stats => stats.user, { cascade: [Cascade.ALL] })
  statistics?: Statistics;

  @Property()
  points = 0;

  constructor(options: UserCreationOptions) {
    super();
    this.userId = options.userId;
    this.email = options.email;
    this.firstname = options.firstname;
    this.lastname = options.lastname;
    this.fullname = options.fullname;
    this.schoolRole = options.schoolRole;
  }

  public async setPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password!);
  }

  public hasChanged(dto: UserCreationOptions): boolean {
    return this.firstname !== dto.firstname
      || this.lastname !== dto.lastname
      || this.fullname !== dto.fullname
      || this.email !== dto.email
      || this.schoolRole !== dto.schoolRole;
  }
}
