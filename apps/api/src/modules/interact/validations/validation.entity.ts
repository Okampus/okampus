import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/modules/pagination';
import type { Content } from '@create/contents/entities/content.entity';
import { BaseContentInteraction } from '@lib/entities/base-content-interaction.entity';
import { ValidationType } from '@lib/types/enums/validation-type.enum';
import type { User } from '@uaa/users/user.entity';

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

@ObjectType()
export class PaginatedValidation extends Paginated(Validation) {}
