import { IsOptional, IsString } from 'class-validator';

export class CreateSocialAccountDto {
  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  pseudo: string;
}
