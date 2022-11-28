import {
  Cascade,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { User } from '@modules/uua/users/user.entity';

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
  @OneToOne('User')
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
