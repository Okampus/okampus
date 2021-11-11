import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends PartialType(OmitType(CreateSubjectDto, ['subjectId'])) {}
