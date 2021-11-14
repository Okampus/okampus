import { OmitType } from '@nestjs/mapped-types';
import {
  IsIn,
  IsInt,
  IsOptional,
} from 'class-validator';
import { FileKind } from '../../shared/lib/types/file-kind.enum';
import { CreateFileUploadDto } from './create-file-upload.dto';

export class CreateAttachmentDto extends OmitType(CreateFileUploadDto, ['fileKind']) {
  @IsOptional()
  @IsInt()
  postId?: number;

  @IsOptional()
  @IsIn([FileKind.Attachment])
  fileKind?: FileKind.Attachment;
}
