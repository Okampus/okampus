import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';
import { TeamRole } from '@common/lib/types/enums/team-role.enum';

@InputType()
export class CreateTeamMembershipRequestDto {
  @Field(() => TeamRole, { nullable: true })
  @IsEnum(TeamRole)
  @IsOptional()
  role?: TeamRole;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  originalFormId?: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  formSubmission?: object[] | object;
}
