import {
  Cascade,
  Collection,
  Entity,
  Enum,
  Index,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import type { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import { STATISTICS_INCLUDED } from '../shared/lib/constants';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { UserCreationOptions } from '../shared/lib/types/interfaces/user-creation-options.interface';
import { Role } from '../shared/modules/authorization/types/role.enum';
import { SchoolRole } from '../shared/modules/authorization/types/school-role.enum';
// eslint-disable-next-line import/no-cycle
import { Statistics } from '../statistics/statistics.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryKey()
  userId: string;

  @Property({ type: 'text' })
  firstname!: string;

  @Property({ type: 'text' })
  lastname!: string;

  @Property({ type: 'text' })
  @Exclude()
  password?: string;

  @Property({ type: 'text' })
  @Index()
  email!: string;

  @OneToMany('BadgeUnlock', 'user')
  @Exclude()
  badges = new Collection<BadgeUnlock>(this);

  // TODO: Add full 'reputation' support
  @Property()
  reputation = 0;

  @Property({ type: 'text' })
  avatar?: string | null;

  @Enum({ items: () => Role, array: true, default: [Role.User] })
  roles: Role[] = [Role.User];

  @Enum(() => SchoolRole)
  schoolRole!: SchoolRole;

  @Property({ type: 'text' })
  color?: string;

  @Property({ type: 'text' })
  signature?: string;

  @Property({ type: 'text' })
  banner?: string;

  @Property({ type: 'text' })
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
      || this.email !== dto.email
      || this.schoolRole !== dto.schoolRole;
  }

  public getFullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}
