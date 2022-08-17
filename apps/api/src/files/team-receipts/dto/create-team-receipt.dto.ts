import {
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateTeamReceiptDto extends CreateFileUploadDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}
