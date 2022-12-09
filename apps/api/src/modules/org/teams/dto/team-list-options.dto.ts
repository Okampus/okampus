import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationOptions } from '@common/modules/pagination';
import { TeamsFilterDto } from './teams-filter.dto';

export class TeamListOptions extends IntersectionType(TeamsFilterDto, PaginationOptions) {}
