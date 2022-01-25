import { IsEnum } from 'class-validator';
import { ContentMasterType } from '../../shared/lib/types/content-master-type.enum';

export class ContentMasterTypeDto {
  @IsEnum(ContentMasterType)
  contentMasterType: ContentMasterType;
}
