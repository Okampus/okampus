import { CreateEventDto } from './event-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateEventDto extends PartialType(CreateEventDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
