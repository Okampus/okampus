import {
  IsArray,
  IsBoolean,
  IsLatLong,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateArticleDto {
  @Length(15, 100)
  @IsString()
  title: string;

  @Length(50, 2000)
  @IsString()
  body: string;

  @IsOptional()
  @IsLatLong()
  location?: string;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  category: string;

  @IsBoolean()
  isDraft: boolean;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
