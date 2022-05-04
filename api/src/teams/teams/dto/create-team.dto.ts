import {
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
  description: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsUrl()
  membershipRequestLink?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  membershipRequestMessage?: string;
}
