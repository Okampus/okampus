import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';

// NOTE: Other FileUpload props are implicitely retrieved from the uploaded file
@InputType()
export class FileUploadProps {
  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  lastModifiedAt?: Date;
}
