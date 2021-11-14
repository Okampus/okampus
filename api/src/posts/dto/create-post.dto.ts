import {
  IsArray,
  IsEnum,
  IsString,
  Length,
} from 'class-validator';
import { PostType } from '../../shared/lib/types/post-type.enum';

export class CreatePostDto {
  @Length(15, 100)
  @IsString()
  title: string;

  @Length(50, 2000)
  @IsString()
  body: string;

  @IsEnum(PostType)
  type: PostType;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
