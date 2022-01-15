import { IntersectionType } from '@nestjs/mapped-types';
import { IsEnum, IsString, Length } from 'class-validator';
import { PostType } from '../../shared/lib/types/post-type.enum';
import { AssigneesDto } from './assignees.dto';
import { TagsDto } from './tags.dto';

export class CreatePostDto extends IntersectionType(AssigneesDto, TagsDto) {
  @Length(15, 100)
  @IsString()
  title: string;

  @Length(50, 2000)
  @IsString()
  body: string;

  @IsEnum(PostType)
  type: PostType;
}
