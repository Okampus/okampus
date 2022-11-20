import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';
import { TeamEventRegisterStatus } from '../../../../shared/lib/types/enums/team-event-register-status.enum';

@InputType()
export class CreateTeamEventRegistrationDto {
  @Field(() => TeamEventRegisterStatus)
  @IsEnum(TeamEventRegisterStatus)
  status!: TeamEventRegisterStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  originalFormId?: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  formSubmission?: object[] | object;
}
