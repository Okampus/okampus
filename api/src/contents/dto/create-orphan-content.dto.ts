import { IsString, Length } from 'class-validator';
import { ContentMasterTypeDto } from './content-master-type.dto';

export class CreateOrphanContentDto extends ContentMasterTypeDto {
  @Length(25, 2000)
  @IsString()
  body: string;
}
