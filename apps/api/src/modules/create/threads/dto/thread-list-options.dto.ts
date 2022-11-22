import { IsEnum, IsOptional } from 'class-validator';
import { ContentListOptionsDto } from '@meta/shared/lib/dto/list-options.dto';
import { ThreadType } from '@meta/shared/lib/types/enums/thread-type.enum';

export class ThreadListOptionsDto extends ContentListOptionsDto {
  @IsOptional()
  @IsEnum(ThreadType)
  type?: ThreadType;
}
