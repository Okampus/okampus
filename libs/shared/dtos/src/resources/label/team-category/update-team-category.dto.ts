import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Snowflake } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { CreateTeamCategoryDto } from './create-team-category.dto';

@InputType()
export class UpdateTeamCategoryDto extends PartialType(CreateTeamCategoryDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
