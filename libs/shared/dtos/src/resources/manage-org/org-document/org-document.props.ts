import { Field, InputType } from '@nestjs/graphql';
import { OrgDocumentType } from '@okampus/shared/enums';
import { IsString } from 'class-validator';

@InputType()
export class OrgDocumentProps {
  @Field(() => OrgDocumentType)
  // @IsEnum(() => OrgDocumentType)
  @IsString()
  type!: OrgDocumentType;
}
