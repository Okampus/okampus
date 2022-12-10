import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { PaginationOptions } from '@common/modules/pagination';
import { AnnouncementState } from '@lib/types/enums/announcement-state.enum';

export default class ListAnnouncementsDto extends PaginationOptions {
  @IsOptional()
  @IsIn([...Object.values(AnnouncementState), 'all'])
  state?: AnnouncementState | 'all';

  @IsOptional()
  @IsBoolean()
  current?: boolean;
}
