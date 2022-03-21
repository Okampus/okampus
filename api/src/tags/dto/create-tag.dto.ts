import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Colors } from '../../shared/lib/types/enums/colors.enum';

const tagRegex = /^[\d:a-z-]+$/;

export class CreateTagDto {
  @Length(1, 50)
  @Matches(tagRegex)
  @IsString()
  name: string;

  @IsEnum(Colors)
  color: Colors;

  @IsOptional()
  @IsString()
  description?: string;
}
