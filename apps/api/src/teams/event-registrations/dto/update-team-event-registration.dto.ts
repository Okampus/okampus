import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { CreateTeamEventRegistrationDto } from './create-team-event-registration.dto';

export class UpdateTeamEventRegistrationDto extends PartialType(OmitType(CreateTeamEventRegistrationDto, ['originalFormId', 'formSubmission'])) {
  @IsOptional()
  @IsBoolean()
  present?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  participationScore?: number;
}
