import { InputType, IntersectionType } from '@nestjs/graphql';
import { ContentKindDto } from './content-kind.dto';
import { CreateOrphanContentDto } from './create-orphan-content.dto';
import { ParentDto } from './parent.dto';

@InputType()
export class CreateContentWithKindDto extends IntersectionType(
  CreateOrphanContentDto,
  IntersectionType(ContentKindDto, ParentDto),
) {}
