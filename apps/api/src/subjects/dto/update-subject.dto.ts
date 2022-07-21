import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends PartialType(OmitType(CreateSubjectDto, ['id'])) {}
