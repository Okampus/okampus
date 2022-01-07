import { OmitType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { FileKind } from '../../../shared/lib/types/file-kind.enum';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateProfileImageDto extends OmitType(CreateFileUploadDto, ['fileKind']) {
  @IsOptional()
  @IsIn([FileKind.ProfileImage])
  fileKind?: FileKind.ProfileImage;
}
