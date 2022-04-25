import { IntersectionType } from '@nestjs/mapped-types';
import { PaginateDto } from '../../modules/pagination';
import { SortDto } from '../../modules/sorting';

export class ListOptionsDto extends IntersectionType(PaginateDto, SortDto) {}
