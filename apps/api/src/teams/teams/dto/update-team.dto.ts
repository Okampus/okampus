import {
  Field,
  InputType,
  Int,
  PartialType,
} from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';
import { CreateTeamDto } from './create-team.dto';

@InputType()
export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  membershipRequestFormId?: number | null;
}
