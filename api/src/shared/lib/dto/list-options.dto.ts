// eslint-disable-next-line max-classes-per-file
import { IntersectionType } from '@nestjs/mapped-types';
import { PaginateDto } from '../../modules/pagination';
import { SortDto } from '../../modules/sorting';
import { ContentSortDto } from '../../modules/sorting/sort.dto';

export class ListOptionsDto extends IntersectionType(PaginateDto, SortDto) {}

export class ContentListOptionsDto extends IntersectionType(PaginateDto, ContentSortDto) {}
