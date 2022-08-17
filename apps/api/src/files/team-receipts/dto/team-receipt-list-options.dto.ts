import { IsInt } from 'class-validator';
import { PaginateDto } from '../../../shared/modules/pagination';

export class TeamReceiptListOptions extends PaginateDto {
  @IsInt()
  id: number;
}
