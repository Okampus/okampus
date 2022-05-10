import { IsEnum, IsOptional } from 'class-validator';
import { ContentListOptionsDto } from '../../shared/lib/dto/list-options.dto';
import { ThreadType } from '../../shared/lib/types/enums/thread-type.enum';

export class ThreadListOptionsDto extends ContentListOptionsDto {
  @IsOptional()
  @IsEnum(ThreadType)
  type?: ThreadType;
}
