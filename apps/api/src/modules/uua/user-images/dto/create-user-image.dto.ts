import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CreateFileUploadDto } from '@modules/upload/file-uploads/dto/create-file-upload.dto';

@InputType()
export class CreateUserImageDto extends CreateFileUploadDto {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsString()
  type: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;
}
