import { Embeddable, Property } from '@mikro-orm/core';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('OidcInfoInput')
@ObjectType('OidcInfo')
@Embeddable()
export class OidcInfo {
  @Field(() => Boolean)
  @Property({ type: 'boolean', default: true })
  isOidcEnabled = false;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true, default: null })
  oidcName: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true, default: null })
  oidcClientId: string | null = null;

  @Property({ type: 'text', nullable: true, default: null, hidden: true })
  oidcClientSecret: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true, default: null })
  oidcDiscoveryUrl: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true, default: null })
  oidcScopes: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true, default: null })
  oidcCallbackUri: string | null = null;

  constructor(partial: Partial<OidcInfo>) {
    Object.assign(this, partial);
  }
}
