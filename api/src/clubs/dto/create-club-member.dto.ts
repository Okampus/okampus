import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ClubRole } from '../../shared/lib/types/club-role.enum';

export class CreateClubMemberDto {
  @IsEnum(ClubRole)
  role: ClubRole;

  @IsOptional()
  @IsString()
  roleLabel?: string;
}
