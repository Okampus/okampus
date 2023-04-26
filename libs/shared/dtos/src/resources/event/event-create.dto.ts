import { EventProps } from './event.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class CreateEventDto extends EventProps {
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
