import { IntersectionType } from '@nestjs/mapped-types';
import { PaginateDto } from '../../modules/pagination/paginate.dto';
import { SortDto } from '../../modules/sorting/sort.dto';

export class ListOptionsDto extends IntersectionType(PaginateDto, SortDto) {}
