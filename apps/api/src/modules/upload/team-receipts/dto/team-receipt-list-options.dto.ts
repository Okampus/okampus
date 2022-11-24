import { IsInt } from 'class-validator';
import { PaginateDto } from '@common/modules/pagination';

export class TeamReceiptListOptions extends PaginateDto {
  @IsInt()
  id: number;
}
