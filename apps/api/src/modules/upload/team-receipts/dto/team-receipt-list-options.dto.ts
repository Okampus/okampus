import { IsInt } from 'class-validator';
import { PaginationOptions } from '@common/modules/pagination';

export class TeamReceiptListOptions extends PaginationOptions {
  @IsInt()
  id: number;
}
