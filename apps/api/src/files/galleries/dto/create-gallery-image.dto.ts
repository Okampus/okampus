import {
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateGalleryImageDto extends CreateFileUploadDto {
  @IsInt()
  teamId: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  caption?: string;
}
