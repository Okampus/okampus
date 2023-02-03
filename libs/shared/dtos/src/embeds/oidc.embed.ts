import { Embeddable, Property } from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('OidcInfoInput')
@ObjectType('OidcInfo')
@Embeddable()
export class OidcInfo {
  @Field(() => Boolean)
  @Property({ type: 'boolean' })
  oidcEnabled = false;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  oidcName: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  oidcClientId: string | null = null;

  @Property({ type: 'text', nullable: true, hidden: true })
  oidcClientSecret: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  oidcDiscoveryUrl: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  oidcScopes: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  oidcCallbackUri: string | null = null;

  constructor(partial: Partial<OidcInfo>) {
    Object.assign(this, partial);
  }
}
