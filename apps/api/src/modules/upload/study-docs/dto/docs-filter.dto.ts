import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { StudyDocType } from '@common/lib/types/enums/study-doc-type.enum';
import { PaginationArgs } from '@common/modules/pagination';

export class DocsFilterDto extends PaginationArgs {
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
