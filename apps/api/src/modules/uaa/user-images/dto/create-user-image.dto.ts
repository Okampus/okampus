import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserImageType } from '@common/lib/types/enums/user-image-type.enum';
import { CreateFileUploadDto } from '@modules/upload/file-uploads/dto/create-file-upload.dto';

@InputType()
export class CreateUserImageDto extends CreateFileUploadDto {
  @Field()
  @IsString()
  userId: string;

  @Field(() => UserImageType)
  @IsEnum(UserImageType)
  type: UserImageType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;
}
