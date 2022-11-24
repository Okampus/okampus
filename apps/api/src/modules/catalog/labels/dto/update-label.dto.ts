import { PartialType } from '@nestjs/mapped-types';
import { CreateLabelDto } from '@modules/catalog/labels/dto/create-label.dto';

export class UpdateLabelDto extends PartialType(CreateLabelDto) {}
