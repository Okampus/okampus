import { Field, InputType } from '@nestjs/graphql';
import {
 IsEnum, IsNumber, IsOptional, IsString,
} from 'class-validator';
import { TeamImageType } from '@common/lib/types/enums/team-image-type.enum';
import { CreateFileUploadDto } from '@modules/upload/file-uploads/dto/create-file-upload.dto';

@InputType()
export class CreateTeamImageDto extends CreateFileUploadDto {
  @Field()
  @IsNumber()
  teamId: number;

  @Field(() => TeamImageType)
  @IsEnum(TeamImageType)
  type: TeamImageType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;
}
