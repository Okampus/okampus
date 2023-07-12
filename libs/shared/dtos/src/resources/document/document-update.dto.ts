import { CreateDocumentDto } from './document-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @Field(() => String)
  @IsString()
  id!: string;
}
