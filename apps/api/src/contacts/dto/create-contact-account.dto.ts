import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateContactAccountDto {
  @IsInt()
  id: number;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  pseudo: string;
}
