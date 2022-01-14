import { IsInt, IsOptional, IsString } from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';
import type { ContentIdsOptions } from '../content-options-xor.type';

export class CreateAttachmentDto extends CreateFileUploadDto {
  @IsOptional()
  @IsInt()
  postId?: number;

  @IsOptional()
  @IsString()
  replyId?: string;

  @IsOptional()
  @IsInt()
  articleId?: number;
}

export type ValidCreateAttachmentDto = ContentIdsOptions & CreateFileUploadDto;
