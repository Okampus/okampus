import { IntersectionType } from '@nestjs/swagger';
import { CreateOrphanContentDto } from './create-orphan-content.dto';
import { ParentDto } from './parent.dto';

export class CreateContentDto extends IntersectionType(CreateOrphanContentDto, ParentDto) {}
