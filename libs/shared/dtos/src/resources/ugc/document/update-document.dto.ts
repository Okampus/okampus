import { CreateDocumentDto } from './create-document.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @Field(() => String)
  @IsString()
  id!: Snowflake;
}
