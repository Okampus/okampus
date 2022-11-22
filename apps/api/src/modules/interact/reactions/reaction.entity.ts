import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseContentInteraction } from '@meta/shared/lib/entities/base-content-interaction.entity';
import { AllReaction } from '@meta/shared/lib/types/enums/reaction.enum';
import type { Content } from '@modules/create/contents/entities/content.entity';
import type { User } from '@modules/uua/users/user.entity';

@ObjectType()
@Entity()
export class Reaction extends BaseContentInteraction {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => AllReaction)
  @Enum(() => AllReaction)
  @Index()
  value!: AllReaction;

  constructor(options: {
    user: User;
    content: Content;
    value: AllReaction;
  }) {
    super(options);
    this.assign(options);
  }
}
