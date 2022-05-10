import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateWikiPageDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
}
