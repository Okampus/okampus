import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
import { TeamRole } from '../../../shared/lib/types/enums/team-role.enum';

@InputType()
export class CreateTeamMembershipRequestDto {
  @Field(() => TeamRole, { nullable: true })
  @IsEnum(TeamRole)
  @IsOptional()
  role?: TeamRole;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @IsObject()
  meta?: object;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  originalFormId?: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @IsObject()
  formSubmission?: object;
}
