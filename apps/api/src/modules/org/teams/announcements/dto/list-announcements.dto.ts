import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { AnnouncementState } from '@common/lib/types/enums/announcement-state.enum';
import { PaginationArgs } from '@common/modules/pagination';

export default class ListAnnouncementsDto extends PaginationArgs {
  @IsOptional()
  @IsIn([...Object.values(AnnouncementState), 'all'])
  state?: AnnouncementState | 'all';

  @IsOptional()
  @IsBoolean()
  current?: boolean;
}
