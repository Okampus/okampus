import { Field, InputType } from '@nestjs/graphql';
import { LocationType } from '@okampus/shared/enums';

import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class LocationProps {
  @Field(() => LocationType)
  @IsEnum(LocationType)
  type!: LocationType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  locationDetails?: string = '';

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  onlineLink?: string = '';
}
