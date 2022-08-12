import { IsString } from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateProfileImageDto extends CreateFileUploadDto {
  @IsString()
  type: string;
}
