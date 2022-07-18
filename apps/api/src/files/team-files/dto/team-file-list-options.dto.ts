import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TeamFileType } from '../../../shared/lib/types/enums/team-file-type.enum';
import { PaginateDto } from '../../../shared/modules/pagination';

export class TeamFileListOptions extends PaginateDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsEnum(TeamFileType)
  type: TeamFileType;
}
