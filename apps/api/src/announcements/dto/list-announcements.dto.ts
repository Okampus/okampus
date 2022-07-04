import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { AnnouncementState } from '../../shared/lib/types/enums/announcement-state.enum';
import { PaginateDto } from '../../shared/modules/pagination';

export default class ListAnnouncementsDto extends PaginateDto {
  @IsOptional()
  @IsIn([...Object.values(AnnouncementState), 'all'])
  state?: AnnouncementState | 'all';

  @IsOptional()
  @IsBoolean()
  current?: boolean;
}
