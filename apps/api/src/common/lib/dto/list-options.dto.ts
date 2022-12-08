import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationArgs } from '../../modules/pagination';
import { SortDto } from '../../modules/sorting';
import { ContentSortDto } from '../../modules/sorting/sort.dto';

export class ListOptionsDto extends IntersectionType(PaginationArgs, SortDto) {}

export class ContentListOptionsDto extends IntersectionType(PaginationArgs, ContentSortDto) {}
