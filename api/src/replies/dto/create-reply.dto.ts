import { IsString, Length } from 'class-validator';

export class CreateReplyDto {
  @Length(25, 2000)
  @IsString()
  body: string;
}
