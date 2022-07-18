import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Content } from '../contents/entities/content.entity';
import { BaseContentInteraction } from '../shared/lib/entities/base-content-interaction.entity';
import { AllReaction } from '../shared/lib/types/enums/reaction.enum';
import type { User } from '../users/user.entity';

@ObjectType()
@Entity()
export class Reaction extends BaseContentInteraction {
  @Field(() => Int)
  @PrimaryKey()
  reactionId!: number;

  @Field(() => AllReaction)
  @Enum(() => AllReaction)
  @Index()
  value!: AllReaction;

  constructor(options: {
    user: User;
    content: Content;
    value: AllReaction;
  }) {
    super();
    this.content = options.content;
    this.contentMaster = options.content.contentMaster;
    this.user = options.user;
    this.value = options.value;
  }
}
