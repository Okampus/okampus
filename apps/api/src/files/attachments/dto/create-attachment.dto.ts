import { IsInt, IsOptional } from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateAttachmentDto extends CreateFileUploadDto {
  // TODO: make this a required field again (and update the entity/service/frontend)
  @IsOptional()
  @IsInt()
  contentId?: number;
}
