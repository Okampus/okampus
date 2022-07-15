import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { ContentMasterTypeDto } from './content-master-type.dto';

@InputType()
export class CreateOrphanContentDto extends ContentMasterTypeDto {
  @Field()
  @Length(10, 10_000)
  @IsString()
  body: string;
}
