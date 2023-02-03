import { Embeddable, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Embeddable()
export class UserSettings {
  @Field(() => Boolean)
  @Property({ type: 'boolean' })
  darkModeActivated = false;

  /** Export my data via the main email when my account is deactivated */
  @Field(() => Boolean)
  @Property({ type: 'boolean' })
  gdprEndOfLifeExport = true;

  /** Anonymize my data when my account is deactivated */
  @Field(() => Boolean)
  @Property({ type: 'boolean' })
  gdprEndOfLifeAnonymize = false;

  constructor(partial: Partial<UserSettings>) {
    Object.assign(this, partial);
  }
}
