import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PostType } from '../../shared/lib/types/post-type.enum';

export class CreatePostDto {
  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(100)
  @IsString()
  title: string;

  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(2000)
  @IsString()
  body: string;

  @IsEnum(PostType)
  type: PostType;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
