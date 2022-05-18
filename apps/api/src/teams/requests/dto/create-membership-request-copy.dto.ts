import { IsEnum, IsOptional } from 'class-validator';
import { TeamRole } from '../../../shared/lib/types/enums/team-role.enum';

export class CreateTeamMembershipRequestDto {
  @IsEnum(TeamRole)
  @IsOptional()
  role?: TeamRole;
}
