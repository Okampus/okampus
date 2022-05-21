import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { TeamKind } from '../../../shared/lib/types/enums/team-kind.enum';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsEnum(TeamKind)
  kind: TeamKind;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsUrl()
  membershipRequestLink?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  membershipRequestMessage?: string;
}
