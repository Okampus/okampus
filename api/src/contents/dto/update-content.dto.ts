import { OmitType } from '@nestjs/swagger';
import { CreateContentDto } from './create-content.dto';

export class UpdateContentDto extends OmitType(CreateContentDto, ['contentMasterType', 'parentId']) {}
