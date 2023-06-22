import { Embeddable, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Embeddable()
export class UserSettings {
  @Field(() => Boolean)
  @Property({ type: 'boolean', default: false })
  isDarkModeActivated = false;

  /** Export my data via the main email when my account is deactivated */
  @Field(() => Boolean)
  @Property({ type: 'boolean', default: true })
  isGdprExportedOnAccountDeactivation = true;

  /** Anonymize my data when my account is deactivated */
  @Field(() => Boolean)
  @Property({ type: 'boolean', default: false })
  isGdprAnonymizedOnAccountDeactivation = false;

  constructor(partial: Partial<UserSettings>) {
    Object.assign(this, partial);
  }
}
