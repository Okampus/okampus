import { CreateTagDto } from './tag-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateTagDto extends PartialType(CreateTagDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
