import {
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Content } from '../contents/entities/content.entity';
import { BaseContentInteraction } from '../shared/lib/entities/base-content-interaction.entity';
import type { User } from '../users/user.entity';

@ObjectType()
@Entity()
export class Favorite extends BaseContentInteraction {
  @Field(() => Int)
  @PrimaryKey()
  favoriteId!: number;

  @Field(() => Boolean)
  @Property({ default: true })
  active!: boolean;

  constructor(options: {
    user: User;
    content: Content;
  }) {
    super();
    this.content = options.content;
    if (options.content.contentMaster)
      this.contentMaster = options.content.contentMaster;
    this.user = options.user;
  }
}
