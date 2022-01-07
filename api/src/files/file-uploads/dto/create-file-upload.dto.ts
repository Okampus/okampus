import {
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { FileKind } from '../../../shared/lib/types/file-kind.enum';

export class CreateFileUploadDto {
  @IsEnum(FileKind)
  fileKind: FileKind;

  @IsOptional()
  @IsDate()
  fileLastModifiedAt?: Date;
}
