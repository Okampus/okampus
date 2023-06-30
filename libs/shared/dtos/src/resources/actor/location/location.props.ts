import { Field, InputType } from '@nestjs/graphql';
import { LocationType } from '@okampus/shared/enums';

import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class LocationProps {
  @Field(() => LocationType)
  @IsEnum(LocationType)
  type!: LocationType;

  @Field(() => String)
  @Length(3, 150)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  details?: string = '';

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  onlineLink?: string = '';
}