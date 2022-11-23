import { IsInt } from 'class-validator';
import { PaginateDto } from '@common/modules/pagination';

export class TeamGalleryListOptions extends PaginateDto {
  @IsInt()
  id: number;
}
