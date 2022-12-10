import { PartialType } from '@nestjs/mapped-types';
import { CreateInfoDocDto } from '@upload/info-docs/dto/create-info-doc.dto';

export class UpdateInfoDocDto extends PartialType(CreateInfoDocDto) {}
