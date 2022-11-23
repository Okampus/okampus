/* eslint-disable import/no-cycle */
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseContentInteraction } from '@common/lib/entities/base-content-interaction.entity';
import type { Content } from '@modules/create/contents/entities/content.entity';
import type { User } from '@modules/uua/users/user.entity';

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
