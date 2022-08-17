import {
  IsInt,
  IsOptional,
} from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateTeamGalleryDto extends CreateFileUploadDto {
  @IsInt()
  id: number;

  @IsInt()
  order: number;

  @IsInt()
  width: number;

  @IsInt()
  height: number;

  @IsOptional()
  @IsInt()
  eventId: number;
}
