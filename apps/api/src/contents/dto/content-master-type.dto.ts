import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { ContentMasterType } from '../../shared/lib/types/enums/content-master-type.enum';

@InputType()
export class ContentMasterTypeDto {
  @Field(() => ContentMasterType)
  @IsEnum(ContentMasterType)
  contentMasterType: ContentMasterType;
}
