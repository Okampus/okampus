import { IsString } from 'class-validator';

export class CreateClubMemberDto {
  @IsString()
  role: string;
}
