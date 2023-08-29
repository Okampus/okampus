import { CreateProjectDto } from './project-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @Field(() => String)
  id!: string;
}
