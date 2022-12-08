import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationArgs } from '@common/modules/pagination';
import { TeamsFilterDto } from './teams-filter.dto';

export class TeamListOptions extends IntersectionType(TeamsFilterDto, PaginationArgs) {}
