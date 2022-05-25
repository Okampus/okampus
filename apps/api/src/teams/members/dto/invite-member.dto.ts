import { IsBoolean, IsOptional } from 'class-validator';

export class InviteMemberDto {
  @IsBoolean()
  @IsOptional()
  force?: boolean;
}
