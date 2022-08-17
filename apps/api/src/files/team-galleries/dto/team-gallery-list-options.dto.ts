import { IsInt } from 'class-validator';
import { PaginateDto } from '../../../shared/modules/pagination';

export class TeamGalleryListOptions extends PaginateDto {
  @IsInt()
  id: number;
}
