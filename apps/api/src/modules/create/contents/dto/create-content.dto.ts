import { IntersectionType } from '@nestjs/mapped-types';
import { CreateOrphanContentDto } from '@create/contents/dto/create-orphan-content.dto';
import { ParentDto } from './parent.dto';

export class CreateContentDto extends IntersectionType(CreateOrphanContentDto, ParentDto) {}
