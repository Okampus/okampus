import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @Length(25, 2000)
  @IsString()
  body: string;
}
