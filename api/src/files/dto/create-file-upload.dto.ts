import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFileUploadDto {
  @IsNotEmpty()
  @IsString()
  originalName: string;

  @IsString()
  type: string;

  @IsString()
  fileKind: string;

  @IsNotEmpty()
  @IsInt()
  fileSize: number;

  @IsOptional()
  @IsDate()
  fileLastModifiedAt: Date;
}
