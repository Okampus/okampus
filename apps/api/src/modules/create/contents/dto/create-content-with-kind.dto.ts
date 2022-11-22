import { InputType, IntersectionType } from '@nestjs/graphql';
import { CreateOrphanContentDto } from '@modules/create/contents/dto/create-orphan-content.dto';
import { ContentKindDto } from './content-kind.dto';
import { ParentDto } from './parent.dto';

@InputType()
export class CreateContentWithKindDto extends IntersectionType(
  CreateOrphanContentDto,
  IntersectionType(ContentKindDto, ParentDto),
) {}
