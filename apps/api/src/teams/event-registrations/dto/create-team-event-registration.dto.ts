import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { TeamEventRegisterStatus } from '../../../shared/lib/types/enums/team-event-register-status.enum';

export class CreateTeamEventRegistrationDto {
  @IsEnum(TeamEventRegisterStatus)
  status!: TeamEventRegisterStatus;

  @IsOptional()
  @IsInt()
  originalFormId?: number;

  @IsOptional()
  @IsObject()
  formSubmission?: object;
}
