import { TenantEventProps } from './event.props';
import { ContentMasterProps } from '../content-master.props';
import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateEventDto extends IntersectionType(TenantEventProps, ContentMasterProps) {
  @Field(() => String)
  @IsString()
  description!: string;

  @Field(() => String)
  @IsString()
  supervisorId!: Snowflake;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  orgIds!: Snowflake[];
}
