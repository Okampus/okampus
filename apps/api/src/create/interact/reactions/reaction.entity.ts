import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseContentInteraction } from '../../../shared/lib/entities/base-content-interaction.entity';
import { AllReaction } from '../../../shared/lib/types/enums/reaction.enum';
import type { User } from '../../../uua/users/user.entity';
import type { Content } from '../../contents/entities/content.entity';

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
