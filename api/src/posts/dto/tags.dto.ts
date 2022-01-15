import { IsArray, IsString } from 'class-validator';

export class TagsDto {
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
