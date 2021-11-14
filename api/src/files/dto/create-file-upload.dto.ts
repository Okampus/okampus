import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileKind } from '../../shared/lib/types/file-kind.enum';

export class CreateFileUploadDto {
  @IsString()
  type: string;

  @IsEnum(FileKind)
  fileKind: FileKind;

  @IsOptional()
  @IsDate()
  fileLastModifiedAt?: Date;
}
