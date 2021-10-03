import { IsIn } from 'class-validator';

export class VoteDto {
  @IsIn([-1, 0, 1])
  value: -1 | 0 | 1;
}
