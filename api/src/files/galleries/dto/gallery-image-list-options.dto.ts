import { IsInt } from 'class-validator';
import { PaginateDto } from '../../../shared/modules/pagination';

export class GalleryImageListOptions extends PaginateDto {
  @IsInt()
  teamId: number;
}
