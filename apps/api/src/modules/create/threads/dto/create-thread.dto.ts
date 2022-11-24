import { Field, InputType, IntersectionType } from '@nestjs/graphql';
import { IsEnum, IsString, Length } from 'class-validator';
import { ThreadType } from '@common/lib/types/enums/thread-type.enum';
import { CreateOrphanContentDto } from '@modules/create/contents/dto/create-orphan-content.dto';
import { AssigneesDto } from './assignees.dto';
import { TagsDto } from './tags.dto';

@InputType()
export class CreateThreadDto extends IntersectionType(
  CreateOrphanContentDto,
  IntersectionType(AssigneesDto, TagsDto),
) {
  @Field(() => String)
  @Length(10, 100)
  @IsString()
  title: string;

  @Field(() => ThreadType)
  @IsEnum(ThreadType)
  type: ThreadType;

  @Field(() => String)
  @IsString()
  scope: string;
}