import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { RegisterStatus } from '../../../shared/lib/types/enums/register-status.enum';

export class CreateTeamEventRegistrationDto {
  @IsEnum(RegisterStatus)
  status!: RegisterStatus;

  @IsOptional()
  @IsInt()
  originalFormId?: number;

  @IsOptional()
  @IsObject()
  formSubmission?: object;
}
