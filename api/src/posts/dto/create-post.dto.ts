import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PostTypes } from '../../shared/types/post-types.enum';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsEnum(PostTypes)
  type: PostTypes;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
