import { Embeddable, Property } from '@mikro-orm/core';
import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType('AddressInput')
@ObjectType('Address')
@Embeddable()
export class Address {
  @Field(() => String)
  @Property({ type: 'text' })
  name!: string;

  @Field(() => Float, { nullable: true })
  @Property({ type: 'float', nullable: true })
  latitude: number | null = null;

  @Field(() => Float, { nullable: true })
  @Property({ type: 'float', nullable: true })
  longitude: number | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  street: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  city: string | null = null;

  @Field(() => Int, { nullable: true })
  @Property({ type: 'int', nullable: true })
  zip: number | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  state: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  country: string | null = null;

  constructor(data: { name: string } & Partial<Address>) {
    Object.assign(this, data);
  }
}
