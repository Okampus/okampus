import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { StudyDocType } from '@meta/shared/lib/types/enums/study-doc-type.enum';
import { PaginateDto } from '@meta/shared/modules/pagination';

export class DocsFilterDto extends PaginateDto {
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
