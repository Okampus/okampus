import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { ContentKind } from '../../shared/lib/types/enums/content-kind.enum';

@InputType()
export class ContentKindDto {
  @Field(() => ContentKind)
  @IsEnum(ContentKind)
  contentKind: ContentKind;
}
