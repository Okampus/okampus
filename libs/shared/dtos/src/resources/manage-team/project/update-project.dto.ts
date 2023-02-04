import { CreateProjectDto } from './create-project.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @Field(() => String)
  id!: Snowflake;
}
