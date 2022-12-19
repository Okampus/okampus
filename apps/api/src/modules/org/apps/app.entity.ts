import {
  Cascade,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/modules/pagination';
import { BaseEntity } from '@lib/entities/base.entity';
import { User } from '@uaa/users/user.entity';

@ObjectType()
@Entity()
export class App extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  description: string | null = null;

  @Field(() => User)
  @ManyToOne({ type: User, cascade: [Cascade.ALL], nullable: true })
  owner: User;

  @Field(() => User, { nullable: true })
  @OneToOne('User', { nullable: true })
  bot: User | null = null;

  constructor(options: {
    name: string;
    description?: string | null;
    owner: User;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedApp extends Paginated(App) {}
