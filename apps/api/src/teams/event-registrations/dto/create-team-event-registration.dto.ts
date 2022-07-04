import { IsEnum } from 'class-validator';
import { RegisterStatus } from '../../../shared/lib/types/enums/register-status.enum';

export class CreateTeamEventRegistrationDto {
  @IsEnum(RegisterStatus)
  status!: RegisterStatus;
}
