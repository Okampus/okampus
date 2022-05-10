import { IsDate, IsOptional } from 'class-validator';

export class CreateFileUploadDto {
  @IsOptional()
  @IsDate()
  fileLastModifiedAt?: Date;
}
