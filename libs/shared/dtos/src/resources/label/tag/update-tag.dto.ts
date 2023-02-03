import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Snowflake } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

@InputType()
export class UpdateTagDto extends PartialType(CreateTagDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
