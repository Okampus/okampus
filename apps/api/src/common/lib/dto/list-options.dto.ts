import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationOptions } from '@common/modules/pagination';
import { SortDto } from '@common/modules/sorting';
import { ContentSortDto } from '@common/modules/sorting/sort.dto';

export class ListOptionsDto extends IntersectionType(PaginationOptions, SortDto) {}

export class ContentListOptionsDto extends IntersectionType(PaginationOptions, ContentSortDto) {}
