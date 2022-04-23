import { IsEnum, IsOptional } from 'class-validator';
import { TeamKind } from '../../shared/lib/types/enums/team-kind.enum';

export class TeamsFilterDto {
  @IsOptional()
  @IsEnum(TeamKind)
  kind?: TeamKind;
}
