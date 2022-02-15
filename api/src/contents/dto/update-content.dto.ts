import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateContentDto } from './create-content.dto';

export class UpdateContentDto extends PartialType(OmitType(CreateContentDto, ['contentMasterType', 'parentId'])) {
  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
