import { OmitType } from '@nestjs/mapped-types';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileKind } from '../../../shared/lib/types/file-kind.enum';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';
import type { ContentIdsOptions } from '../content-options-xor.type';

export class CreateAttachmentDto extends OmitType(CreateFileUploadDto, ['fileKind']) {
  @IsOptional()
  @IsInt()
  postId?: number;

  @IsOptional()
  @IsString()
  replyId?: string;

  @IsOptional()
  @IsIn([FileKind.Attachment])
  fileKind?: FileKind.Attachment;
}

export type ValidCreateAttachmentDto = ContentIdsOptions & CreateFileUploadDto;
