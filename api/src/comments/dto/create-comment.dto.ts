import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  body: string;
}
