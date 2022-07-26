import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Content } from '../contents/entities/content.entity';
import { BaseContentInteraction } from '../shared/lib/entities/base-content-interaction.entity';
import { ValidationType } from '../shared/lib/types/enums/validation-type.enum';
import type { User } from '../users/user.entity';

@ObjectType()
@Entity()
export class Validation extends BaseContentInteraction {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Boolean)
  @Property()
  active = true;

  @Field(() => ValidationType)
  @Property()
  type!: ValidationType;

  constructor(options: {
    user: User;
    content: Content;
    type: ValidationType;
  }) {
    super(options);
    this.assign(options);
  }
}
