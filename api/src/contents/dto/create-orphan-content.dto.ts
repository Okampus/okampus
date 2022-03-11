import { IsString, Length } from 'class-validator';
import { ContentMasterTypeDto } from './content-master-type.dto';

export class CreateOrphanContentDto extends ContentMasterTypeDto {
  @Length(10, 10_000)
  @IsString()
  body: string;
}
