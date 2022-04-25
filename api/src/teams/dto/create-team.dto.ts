import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamKind } from '../../shared/lib/types/enums/team-kind.enum';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsEnum(TeamKind)
  kind: TeamKind;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
