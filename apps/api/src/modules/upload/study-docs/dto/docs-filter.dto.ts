import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationOptions } from '@common/modules/pagination';
import { StudyDocType } from '@lib/types/enums/study-doc-type.enum';

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
