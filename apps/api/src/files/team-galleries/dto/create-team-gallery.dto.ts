import { InputType } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
} from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

@InputType()
export class CreateTeamGalleryDto extends CreateFileUploadDto {
  @IsInt()
  teamId: number;

  @IsOptional()
  @IsInt()
  order: number;

  @IsOptional()
  @IsInt()
  eventId: number;
}
