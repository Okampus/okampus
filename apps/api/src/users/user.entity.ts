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
import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
// eslint-disable-next-line import/no-cycle
import { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import type { Favorite } from '../favorites/favorite.entity';
import type { Reaction } from '../reactions/reaction.entity';
import type { Report } from '../reports/report.entity';
// eslint-disable-next-line import/no-cycle
import { Settings } from '../settings/settings.entity';
import { TransformCollection } from '../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import type { UserCreationOptions } from '../shared/lib/types/interfaces/user-creation-options.interface';
import { Role } from '../shared/modules/authorization/types/role.enum';
import { SchoolRole } from '../shared/modules/authorization/types/school-role.enum';
// eslint-disable-next-line import/no-cycle
import { Statistics } from '../statistics/statistics.entity';
import type { Vote } from '../votes/vote.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field()
  @Property({ type: 'text' })
  firstname!: string;

  @Field()
  @Property({ type: 'text' })
  lastname!: string;

  @Property({ type: 'text', hidden: true })
  password: string | null = null;

  @Field()
  @Property({ type: 'text' })
  @Index()
  email!: string;

  @Field(() => [BadgeUnlock], { nullable: true })
  @OneToMany('BadgeUnlock', 'user')
  badges = new Collection<BadgeUnlock>(this);

  // TODO: Add full 'reputation' support
  @Field(() => Int)
  @Property()
  reputation = 0;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  avatar: string | null = null;

  @Field(() => [Role], { nullable: true })
  @Enum({ default: [Role.User] })
  roles = [Role.User];

  @Field(() => SchoolRole)
  @Enum(() => SchoolRole)
  schoolRole!: SchoolRole;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  color: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  signature: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  banner: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  shortDescription: string | null = null;

  @OneToOne('Statistics', 'user', { cascade: [Cascade.ALL] })
  statistics!: Statistics;

  @Field(() => Settings)
  @OneToOne('Settings', 'user', { cascade: [Cascade.ALL] })
  settings!: Settings;

  @OneToMany('Reaction', 'user', { cascade: [Cascade.ALL] })
  @TransformCollection()
  reactions = new Collection<Reaction>(this);

  @OneToMany('Report', 'user', { cascade: [Cascade.ALL] })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany('Vote', 'user', { cascade: [Cascade.ALL] })
  @TransformCollection()
  votes = new Collection<Vote>(this);

  @OneToMany('Favorite', 'user', { cascade: [Cascade.ALL] })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  @Field(() => Int)
  @Property()
  points = 0;

  constructor(options: Omit<UserCreationOptions, 'avatar' | 'banner' | 'password'>) {
    super();
    this.assign(options);
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
