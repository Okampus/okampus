import {
 Field, InputType, IntersectionType, PickType,
} from '@nestjs/graphql';
import { IsEnum, IsString, Length } from 'class-validator';
import { CreateOrphanContentDto } from '../../contents/dto/create-orphan-content.dto';
import { ThreadType } from '../../shared/lib/types/enums/thread-type.enum';
import { AssigneesDto } from './assignees.dto';
import { TagsDto } from './tags.dto';


@InputType()
export class CreateThreadDto extends IntersectionType(PickType(CreateOrphanContentDto, ['body']), IntersectionType(AssigneesDto, TagsDto)) {
  @Field(() => String, { nullable: true })
  @Length(10, 100)
  @IsString()
  title: string;

  @Field(() => ThreadType)
  @IsEnum(ThreadType)
  type: ThreadType;
}
