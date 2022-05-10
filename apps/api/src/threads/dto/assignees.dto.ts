import { IsArray, IsString } from 'class-validator';

export class AssigneesDto {
  @IsArray()
  @IsString({ each: true })
  assignees: string[];
}
