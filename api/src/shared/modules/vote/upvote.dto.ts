import { IsIn } from 'class-validator';

export class UpvoteDto {
  @IsIn([0, 1])
  value: 0 | 1;
}
