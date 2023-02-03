import { Embeddable, Enum, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Colors } from '@okampus/shared/enums';

@ObjectType()
@Embeddable()
export class UserCustomization {
  @Field(() => Colors, { nullable: true })
  @Enum({ items: () => Colors, nullable: true })
  color: Colors | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  signature: string | null = null;

  constructor(partial: Partial<UserCustomization>) {
    Object.assign(this, partial);
  }
}
