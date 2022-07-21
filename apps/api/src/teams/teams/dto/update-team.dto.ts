import { Field, InputType, Int } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional } from 'class-validator';
import { CreateTeamDto } from './create-team.dto';

@InputType()
export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @Field(() => Int)
  @IsOptional()
  @IsInt()
  membershipRequestFormId?: number;
}
