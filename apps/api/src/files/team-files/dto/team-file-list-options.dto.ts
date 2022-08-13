import { IsInt, IsString } from 'class-validator';
import { PaginateDto } from '../../../shared/modules/pagination';

export class TeamFileListOptions extends PaginateDto {
  @IsInt()
  id: number;

  @IsString()
  type: string;
}
