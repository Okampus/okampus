import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Snowflake } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { CreateEventDto } from './create-event.dto';

@InputType()
export class UpdateEventDto extends PartialType(CreateEventDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
