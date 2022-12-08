import { IsInt } from 'class-validator';
import { PaginationArgs } from '@common/modules/pagination';

export class TeamGalleryListOptions extends PaginationArgs {
  @IsInt()
  id: number;
}
