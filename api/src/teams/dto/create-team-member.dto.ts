import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';

export class CreateTeamMemberDto {
  @IsEnum(TeamRole)
  role: TeamRole;

  @IsOptional()
  @IsString()
  roleLabel?: string;
}
