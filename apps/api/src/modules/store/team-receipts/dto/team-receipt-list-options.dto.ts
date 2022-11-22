import { IsInt } from 'class-validator';
import { PaginateDto } from '@meta/shared/modules/pagination';

export class TeamReceiptListOptions extends PaginateDto {
  @IsInt()
  id: number;
}
