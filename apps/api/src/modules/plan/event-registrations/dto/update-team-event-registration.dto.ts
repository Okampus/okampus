import {
  Field,
  InputType,
  Int,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { CreateTeamEventRegistrationDto } from '@modules/plan/event-registrations/dto/create-team-event-registration.dto';

@InputType()
export class UpdateTeamEventRegistrationDto extends PartialType(
  OmitType(CreateTeamEventRegistrationDto, ['originalFormId', 'formSubmission']),
) {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  present?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  participationScore?: number;
}
