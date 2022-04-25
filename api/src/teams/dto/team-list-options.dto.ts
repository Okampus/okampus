import { IntersectionType } from '@nestjs/mapped-types';
import { PaginateDto } from '../../shared/modules/pagination';
import { TeamsFilterDto } from './teams-filter.dto';

export class TeamListOptions extends IntersectionType(TeamsFilterDto, PaginateDto) {}
