import { IntersectionType } from '@nestjs/mapped-types';
import { PaginateDto } from '@common/modules/pagination';
import { TeamsFilterDto } from './teams-filter.dto';

export class TeamListOptions extends IntersectionType(TeamsFilterDto, PaginateDto) {}
