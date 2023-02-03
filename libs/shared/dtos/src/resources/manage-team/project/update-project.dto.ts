import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Snowflake } from '@okampus/shared/types';
import { CreateProjectDto } from './create-project.dto';

@InputType()
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @Field(() => String)
  id!: Snowflake;
}
