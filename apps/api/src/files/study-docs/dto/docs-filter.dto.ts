import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { StudyDocType } from '../../../shared/lib/types/enums/study-doc-type.enum';
import { PaginateDto } from '../../../shared/modules/pagination';

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
