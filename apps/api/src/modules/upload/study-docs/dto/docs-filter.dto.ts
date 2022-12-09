import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { StudyDocType } from '@common/lib/types/enums/study-doc-type.enum';
import { PaginationOptions } from '@common/modules/pagination';

export class DocsFilterDto extends PaginationOptions {
  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsEnum(StudyDocType)
  type?: StudyDocType;
}
