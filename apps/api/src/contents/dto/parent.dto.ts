import { IsInt } from 'class-validator';

export class ParentDto {
  @IsInt()
  parentId: number;
}
