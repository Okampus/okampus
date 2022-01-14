import { IsString } from 'class-validator';

export class CreateClubDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  description: string;

  @IsString()
  icon: string;
}
