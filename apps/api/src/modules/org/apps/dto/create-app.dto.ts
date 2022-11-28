import {
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAppDto {
  @Length(1, 50)
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
