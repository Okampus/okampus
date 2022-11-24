import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from '@modules/catalog/subjects/dto/create-subject.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
