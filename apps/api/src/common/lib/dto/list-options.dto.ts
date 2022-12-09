import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationOptions } from '../../modules/pagination';
import { SortDto } from '../../modules/sorting';
import { ContentSortDto } from '../../modules/sorting/sort.dto';

export class ListOptionsDto extends IntersectionType(PaginationOptions, SortDto) {}

export class ContentListOptionsDto extends IntersectionType(PaginationOptions, ContentSortDto) {}
