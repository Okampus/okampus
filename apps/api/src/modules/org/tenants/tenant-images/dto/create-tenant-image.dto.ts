import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TenantImageType } from '@common/lib/types/enums/tenant-image-type.enum';
import { CreateFileUploadDto } from '@modules/upload/file-uploads/dto/create-file-upload.dto';

@InputType()
export class CreateTenantImageDto extends CreateFileUploadDto {
  @Field()
  @IsString()
  tenantId: string;

  @Field(() => TenantImageType)
  @IsEnum(TenantImageType)
  type: TenantImageType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
