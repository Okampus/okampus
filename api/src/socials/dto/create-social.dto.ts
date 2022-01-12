import {
  IsString,
  Length,
} from 'class-validator';

export class CreateSocialDto {
  @Length(1, 50)
  @IsString()
  name: string;

  @IsString()
  icon: string;
}
