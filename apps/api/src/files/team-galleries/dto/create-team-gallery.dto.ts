import {
  IsInt,
  IsOptional,
} from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateTeamGalleryDto extends CreateFileUploadDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsInt()
  order: number;

  @IsOptional()
  @IsInt()
  eventId: number;
}
