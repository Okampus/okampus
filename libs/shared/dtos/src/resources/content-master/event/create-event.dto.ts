import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { Snowflake } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { ContentMasterProps } from '../content-master.props';
import { TenantEventProps } from './event.props';

@InputType()
export class CreateEventDto extends IntersectionType(TenantEventProps, ContentMasterProps) {
  @Field(() => String)
  @IsString()
  description!: string;

  @Field(() => String)
  @IsString()
  supervisorId!: Snowflake;

  @Field(() => String)
  @IsString()
  orgId!: Snowflake;
}