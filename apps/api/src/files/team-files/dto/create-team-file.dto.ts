import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TeamFileType } from '../../../shared/lib/types/enums/team-file-type.enum';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateTeamFileDto extends CreateFileUploadDto {
  @IsInt()
  teamId: number;

  @IsEnum(TeamFileType)
  type: TeamFileType;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}
