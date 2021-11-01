import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PostTypes } from '../../shared/types/post-types.enum';

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

  @IsEnum(PostTypes)
  type: PostTypes;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
