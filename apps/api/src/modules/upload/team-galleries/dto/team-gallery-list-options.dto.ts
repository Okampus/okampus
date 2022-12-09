import { IsInt } from 'class-validator';
import { PaginationOptions } from '@common/modules/pagination';

export class TeamGalleryListOptions extends PaginationOptions {
  @IsInt()
  id: number;
}
