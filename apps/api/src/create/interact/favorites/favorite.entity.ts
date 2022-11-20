import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseContentInteraction } from '../../../shared/lib/entities/base-content-interaction.entity';
import type { User } from '../../../uua/users/user.entity';
import type { Content } from '../../contents/entities/content.entity';

@ObjectType()
@Entity()
export class Favorite extends BaseContentInteraction {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Boolean)
  @Property()
  active = true;

  constructor(options: {
    user: User;
    content: Content;
    active?: boolean | null;
  }) {
    super(options);
    this.assign(options);
  }
}
