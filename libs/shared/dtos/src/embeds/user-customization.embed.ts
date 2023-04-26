import { Embeddable, Enum, EnumType, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Colors } from '@okampus/shared/enums';

@ObjectType()
@Embeddable()
export class UserCustomization {
  @Field(() => Colors, { nullable: true })
  @Enum({ items: () => Colors, type: EnumType, nullable: true, default: null })
  color: Colors | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true, default: null })
  signature: string | null = null;

  constructor(partial: Partial<UserCustomization>) {
    Object.assign(this, partial);
  }
}
