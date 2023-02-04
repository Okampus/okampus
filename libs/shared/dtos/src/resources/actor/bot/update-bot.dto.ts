import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { CreateBotDto } from './create-bot.dto';

@InputType()
export class UpdateBotDto extends PartialType(CreateBotDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
