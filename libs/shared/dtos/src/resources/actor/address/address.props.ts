import { Property } from '@mikro-orm/core';
import { Field, Float, InputType } from '@nestjs/graphql';
import { Countries } from '@okampus/shared/consts';

import { IsEnum, IsString, Length } from 'class-validator';

@InputType()
export class AddressProps {
  @Field(() => String)
  @Length(3, 150)
  @IsString()
  name?: string;

  @Field(() => Float, { nullable: true })
  latitude: number | null = null;

  @Field(() => Float, { nullable: true })
  longitude: number | null = null;

  @Field(() => String)
  street!: string;

  @Field(() => String)
  city!: string;

  @Field(() => String)
  zip!: string;

  @Field(() => String)
  @Property({ type: 'text' })
  state!: string;

  @Field(() => Countries, { nullable: true })
  @IsEnum(Countries)
  country: Countries = Countries.France;
}
