import {
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateTeamFileDto extends CreateFileUploadDto {
  @IsInt()
  id: number;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}
