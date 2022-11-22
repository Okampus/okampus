import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TeamFileType } from '@meta/shared/lib/types/enums/team-file-type.enum';
import { CreateFileUploadDto } from '@modules/store/file-uploads/dto/create-file-upload.dto';

@InputType()
export class CreateTeamFileDto extends CreateFileUploadDto {
  @Field(() => Int)
  @IsInt()
  teamId: number;

  @Field()
  @IsEnum(TeamFileType)
  type: TeamFileType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  specialType: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}
