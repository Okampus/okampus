import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateContactAccountDto {
  @IsInt()
  contactId: number;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  pseudo: string;
}
