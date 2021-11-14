import { PartialType } from '@nestjs/mapped-types';
import { CreateInfoDocDto } from './create-info-doc.dto';

export class UpdateInfoDocDto extends PartialType(CreateInfoDocDto) {}
