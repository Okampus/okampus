import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { TeamRole } from '../../../shared/lib/types/enums/team-role.enum';

export class CreateTeamMembershipRequestDto {
  @IsEnum(TeamRole)
  @IsOptional()
  role?: TeamRole;

  @IsOptional()
  @IsObject()
  meta?: object;

  @IsOptional()
  @IsInt()
  originalFormId?: number;

  @IsOptional()
  @IsObject()
  formSubmission?: object;
}
