import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TeamFileType } from '../../../shared/lib/types/enums/team-file-type.enum';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

@InputType()
export class CreateTeamFileDto extends CreateFileUploadDto {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field()
  @IsEnum(TeamFileType)
  type: TeamFileType;

  @Field()
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;
}
