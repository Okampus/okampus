import { Property } from '@mikro-orm/core';
import { Field, Float, InputType } from '@nestjs/graphql';
import { Countries } from '@okampus/shared/consts';

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class AddressProps {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string = '';

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  category?: string = '';

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude: number | null = null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude: number | null = null;

  @Field(() => String)
  @IsString()
  streetNumber!: string;

  @Field(() => String)
  @IsString()
  street!: string;

  @Field(() => String)
  @IsString()
  city!: string;

  @Field(() => String)
  @IsString()
  zip!: string;

  @Field(() => String)
  @Property({ type: 'text' })
  state!: string;

  @Field(() => Countries, { nullable: true })
  @IsEnum(Countries)
  country: Countries = Countries.France;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  geoapifyId?: string | null = null;
}
