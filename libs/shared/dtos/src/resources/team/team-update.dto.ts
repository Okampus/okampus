import { CreateTeamDto } from './team-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @Field(() => String)
  @IsString()
  id!: string;
}
