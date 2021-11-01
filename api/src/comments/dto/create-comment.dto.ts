import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MinLength(25)
  @MaxLength(2000)
  @IsString()
  body: string;
}
