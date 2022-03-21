import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { IsEnum, IsString, Length } from 'class-validator';
import { CreateOrphanContentDto } from '../../contents/dto/create-orphan-content.dto';
import { ThreadType } from '../../shared/lib/types/enums/thread-type.enum';
import { AssigneesDto } from './assignees.dto';
import { TagsDto } from './tags.dto';

export class CreateThreadDto extends IntersectionType(AssigneesDto, TagsDto, PickType(CreateOrphanContentDto, ['body'])) {
  @Length(15, 100)
  @IsString()
  title: string;

  @IsEnum(ThreadType)
  type: ThreadType;
}
