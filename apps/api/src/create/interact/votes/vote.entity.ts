import { Entity, Enum, PrimaryKey } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseContentInteraction } from '../../../shared/lib/entities/base-content-interaction.entity';
import type { User } from '../../../uua/users/user.entity';
import type { Content } from '../../contents/entities/content.entity';

@ObjectType()
@Entity()
export class Vote extends BaseContentInteraction {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Int)
  @Enum()
  value!: -1 | 0 | 1;

  constructor(options: {
    user: User;
    content: Content;
    value: -1 | 0 | 1;
  }) {
    super(options);
    this.assign(options);
  }
}
