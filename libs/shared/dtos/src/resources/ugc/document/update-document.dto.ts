import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';
import { IsString } from 'class-validator';
import { CreateDocumentDto } from './create-document.dto';

@InputType()
export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
