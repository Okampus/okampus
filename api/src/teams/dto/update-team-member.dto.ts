import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateTeamMemberDto } from './create-team-member.dto';

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {
  @IsOptional()
  @IsString()
  transferTo?: string;
}
