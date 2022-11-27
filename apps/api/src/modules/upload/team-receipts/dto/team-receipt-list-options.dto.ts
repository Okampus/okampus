import { IsInt } from 'class-validator';
import { PaginationArgs } from '@common/modules/pagination';

export class TeamReceiptListOptions extends PaginationArgs {
  @IsInt()
  id: number;
}
