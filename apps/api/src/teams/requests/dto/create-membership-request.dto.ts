import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { TeamRole } from '../../../shared/lib/types/enums/team-role.enum';

export class CreateTeamMembershipRequestDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsEnum(TeamRole)
  @IsOptional()
  role?: TeamRole;

  @IsOptional()
  @IsObject()
  meta?: object;

  @IsOptional()
  @IsObject()
  formSubmission?: object;
}
