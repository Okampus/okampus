import { IsInt } from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateAttachmentDto extends CreateFileUploadDto {
  @IsInt()
  contentId: number;
}
