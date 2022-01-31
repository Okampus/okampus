import { OmitType } from '@nestjs/mapped-types';
import { CreateContentDto } from './create-content.dto';

export class UpdateContentDto extends OmitType(CreateContentDto, ['contentMasterType', 'parentId']) {}
