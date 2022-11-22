import { PartialType } from '@nestjs/mapped-types';
import { CreateInfoDocDto } from '@modules/store/info-docs/dto/create-info-doc.dto';

export class UpdateInfoDocDto extends PartialType(CreateInfoDocDto) {}
