import { PartialType } from '@nestjs/mapped-types';
import { CreateStudyDocDto } from './create-study-doc.dto';

export class UpdateStudyDocDto extends PartialType(CreateStudyDocDto) {}
