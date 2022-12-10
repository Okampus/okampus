import { IsEnum, IsOptional } from 'class-validator';
import { ContentListOptionsDto } from '@lib/dto/list-options.dto';
import { ThreadType } from '@lib/types/enums/thread-type.enum';

export class ThreadListOptionsDto extends ContentListOptionsDto {
  @IsOptional()
  @IsEnum(ThreadType)
  type?: ThreadType;
}
